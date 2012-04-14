#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sw=4 ts=4

'''
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.html
version: 1.0.0b1
'''

''' A class to parse Javadoc style comments out of javascript to document 
    an API. It is designed to parse one module at a time ''' 
import os, re, string, sys, pprint, logging, logging.config
import json as simplejson
import const
from cStringIO import StringIO 
from optparse import OptionParser

try:
    logging.config.fileConfig(os.path.join(sys.path[0], const.LOGCONFIG))
except:
    pass

log = logging.getLogger('yuidoc.parse')


class DocParser(object):

    def __init__(self, inputdirs, outputdir, outputfile, extension, version, yuiversion):

        def _mkdir(newdir):
            if os.path.isdir(newdir): pass
            elif os.path.isfile(newdir):
                raise OSError("a file with the same name as the desired " \
                              "dir, '%s', already exists." % newdir)
            else:
                head, tail = os.path.split(newdir)
                if head and not os.path.isdir(head): _mkdir(head)
                if tail: os.mkdir(newdir)

        def parseFile(path, file):
            f=open(os.path.join(path, file))
            fileStr=StringIO(f.read()).getvalue()
            log.info("parsing " + file)
            # add a file marker token so the parser can keep track of what is in what file
            content = "\n/** @%s %s \n*/" % (const.FILE_MARKER, file)

            # copy
            out = open(os.path.join(self.outputdir, file), "w")
            out.writelines(fileStr)
            out.close()

            return content + fileStr

        def parseDir(path):
            subdirs = []
            dircontent = ""
            for i in os.listdir(path):
                fullname = os.path.join(path, i)
                if os.path.isdir(fullname):
                    subdirs.append(fullname)
                elif i.lower().endswith(self.extension):
                    dircontent += parseFile(path, i)

            for i in subdirs:
                dircontent += parseDir(i)

            return dircontent

        # An array containing each comment block
        
        # the remainder of the file with the comment blocks removed
        # self.stripped = ""

        # We auto-generate documentation for events that are exposed by
        # attributes.  The signature for these events are different between
        # YUI2 and YUI3.  Specifying the YUI version that is in use will
        # generate the appropriate documentation.  This currently only
        # differentiates between version 2 and 3 of the library, so the
        # 'yuiversion' parameter should start with one or the other.  If the
        # 'yuiversion' parameter is not provided, the 'version' parameter is
        # used instead, which is generally approprate for generating docs for
        # the YUI library.  If neither parameter is provided or valid, the
        # default is the latest YUI major version, currently YUI3.
        if yuiversion:
            majorVersion = yuiversion[:1]
        else:
            majorVersion = version[:1]

        try:
            majorVersion = int(majorVersion)
        except:
            majorVersion = 3

        # Dictionary of parsed data
        self.data = { 
            const.VERSION: version, 
            const.MAJOR_VERSION: majorVersion, 
            const.CLASS_MAP: {}, 
            const.MODULES: {} }

        self.inputdirs = inputdirs
        self.outputdir = os.path.abspath(outputdir)
        _mkdir(self.outputdir)
        self.extension = extension
        self.script=""
        self.subModName = False
        self.deferredModuleClasses=[]
        self.deferredModuleFiles=[]
        self.globals={}
        self.currentGlobal=""

        log.info("-------------------------------------------------------")

        for i in inputdirs: 
            self.currentClass     = ""
            self.currentNamespace = ""
            self.currentModule    = ""
            self.currentFile      = ""
            self.blocks = []
            self.matches = []
            path = os.path.abspath(i)
            self.script = parseDir(path)
            self.extract()

            # log.info("\n\n%s:\n\n%s\n" %("matches", unicode(self.matches)))

            for match in self.matches:
                self.parse(self.tokenize(match))
            

        out = open(os.path.join(self.outputdir, outputfile), "w")

        out.writelines(simplejson.dumps(self.data))
        out.close()


    def getClassName(self, classString, namespace):
        shortName = classString.replace(namespace + ".", "")
        #nss = self.data[const.NAMESPACES]
        #for i in nss:
            # log.warn('asdf ' + i);
            #shortName = shortName.replace(i + ".", "")
        longName  = namespace + "." + shortName
        return shortName, longName
        
    # extract string literals in case they contain the documentation pattern
    literals_pat = re.compile(r'(\'.*?(?<=[^\\])\')|(\".*?(?<=[^\\])\")')

    # extract regex literals in case they contain 
    #regex_pat = re.compile(r'(\/.*?(?<=[^\\])\/)')
    #regex_pat = re.compile(r'(\/[^\s\/\*][^\n]*?(?<=[^\\])\/)')
    regex_pat = re.compile(r'(\/[^\s\/\*][^\n]*\/)')
    
    # the token we will use to restore the string literals
    replaceToken = '~~~%s~~~'
    
    # the pattern to restore the string literals
    restore_pat  = re.compile('~~~(\d+)~~~')
    
    # the pattern for extracting a documentation block and the next line
    docBlock_pat = re.compile('(/\*\*)(.*?)(\*/)([\s\n]*[^\/\n]*)?|(".*?")', re.S)
    
    # after extracting the comment, fix it up (remove *s and leading spaces)
    # blockFilter_pat = re.compile('^\s*\*', re.M)
    blockFilter_pat = re.compile('^[\s|\*|\n]*', re.M)

    # the pattern used to split a comment block to create our token stream
    # this will currently break if there are ampersands in the comments if there
    # is a space before it
    tokenize_pat = re.compile('^\s?(@\w\w*)', re.M);

    # separates compound descriptions: @param foo {int} a foo -> int, foo a foo
    # also:                            @param {int} foo a foo -> int, foo a foo
    compound_pat = re.compile('^\s*?(.*?)\{(.*)\}(.*)|^\s*?(\w+)(.*)', re.S);

    # pulls out the first word of the description parsed by compound_pat: foo, a foo
    # param_pat = re.compile('^\s*?(\w+)(.*)', re.S);
    param_pat = re.compile('^\s*?([^\s]+)(.*)', re.S);

    # tags that do not require a description, used by the tokenizer so that these
    # tags can be used above the block description without breaking things
    singleTags = "constructor public private protected static final beta experimental writeonce global chainable"

    # guess the name and type of a block based upon the code following it
    guess_pat = re.compile('\s*?(var|function)?\s*?(\w+)\s*?[=:]\s*?(function)?.*', re.S)

    # Extracts all of the documentation comment blocks from the script
    def extract(self):

        # Array to keep track of string literals so they are not tokenized with
        # the rest of the comment block
        literals = []

        # removes string literals and puts in a placeholder
        def insertToken_sub(mo):
            # log.info("\n\n%s: %s\n" %("extracted", unicode(mo.groups())))
            literals.append(mo.group())
            return self.replaceToken % (len(literals) - 1)
    
        # restores string literals
        def restore_sub(mo):
            # log.info("\n\n%s: %s\n" %("restore", unicode(literals[int(mo.group(1))])))
            return literals[int(mo.group(1))]

        # guesses name and type
        def guess_sub(mo):
            type = const.PROPERTY
            #log.debug(mo.group(2))
            if mo.group(1) or mo.group(3):
                type = const.FUNCTION

            self.guessedtype = type
            self.guessedname = mo.group(2) 

        # extracts the comment blocks
        def match_sub(match):
            if match.group(5):
                # log.info("\n\n%s:\n\n%s\n" %("group5", unicode(match.group(5))))
                return match.group(5)
            else:
                # get the block and filter out unwanted chars
                block = self.blockFilter_pat.sub("", match.group(2))

                # log.info("\n\n%s:\n\n%s\n" %("block", unicode(block)))

                # restore string literals
                block = self.restore_pat.sub(restore_sub, block)

                # twice
                block = self.restore_pat.sub(restore_sub, block)

                # guess the name and type of the property/method based on the line
                # after the comment
                if match.group(4):
                    nextline = match.group(4)
                    mo = self.guess_pat.search(nextline)
                    if mo:
                        type = const.PROPERTY
                        if string.find(nextline, const.FUNCTION) > 0:
                            type = const.FUNCTION

                        block += "@" + const.GUESSEDTYPE + " " + type + "\n"
                        block += "@" + const.GUESSEDNAME + " " + mo.group(2) + "\n"

                if len(block) > 0:
                    self.matches.append(block)

                return ''

        # remove regex literals
        script = self.regex_pat.sub(insertToken_sub, self.script)

        # log.info("\n\n%s:\n\n%s\n" %("after regex extraction", unicode(script)))

        # remove string literals
        script = self.literals_pat.sub(insertToken_sub, script)

        # log.info("\n\n%s:\n\n%s\n" %("after string extraction", unicode(script)))
    
        # extract comment blocks
        self.docBlock_pat.sub(match_sub, script)
        
        return script

    # Tokenize a single documentation block
    def tokenize(self, block):
        return self.tokenize_pat.split(block)

    # Parse the token stream for a single comment block
    def parse(self, tokens):

        # log.info("\n\n%s:\n\n%s\n" %("tokens", unicode(tokens)))

        tokensCopy = tokens[:] # shallow copy, we keep the orig for error msgs

        def peek():
            """ take a peek at the next token """
            if len(tokensCopy) > 0:
                return tokensCopy[0].strip()

        def next():
            """ grab the next token and remove it from the stack """
            if len(tokensCopy) > 0:
                return tokensCopy.pop(0).strip()

        def isTag(token):
            """ identify an attribute tag vs a description block """
            return token.strip()[:1] == "@"

        def parseParams(tokenMap, dict, srctag=const.PARAM, desttag=const.PARAMS):
            if srctag in tokenMap:
                # params must be an array because they need to stay in order
                if not desttag in dict: dict[desttag] = []
                for i in tokenMap[srctag]:
                    try:
                        # type, description = self.compound_pat.sub(compound_sub, i)

                        match = self.compound_pat.match(i)

                        if match:
                            if match.group(4):
                                type, description = "", unicode(match.group(4) + match.group(5), 'utf-8', 'xmlcharrefreplace')
                            else:
                                type, description = unicode(match.group(2), 'utf-8', 'xmlcharrefreplace'), unicode((match.group(1) + match.group(3)).strip(), 'utf-8', 'xmlcharrefreplace')

                        else:
                            type, description = "", ""


                    except:
                        log.error("\nError, a parameter could not be parsed:\n\n %s\n\n %s\n" %(i, pprint.pformat(tokenMap)))
                        sys.exit()

                    # description.encode('utf-8', 'xmlcharrefreplace')
                    # description = unicode(description, 'utf-8', 'xmlcharrefreplace')


                    mo = self.param_pat.match(description)
                    if mo:
                        name = mo.group(1)
                        description = mo.group(2)
                        description.encode('utf-8', 'xmlcharrefreplace')

                        dict[desttag].append({  
                                const.NAME:        name,
                                const.TYPE:        type, 
                                const.DESCRIPTION: description 
                            })
                    else:
                        log.error("Error, could not parse param -- %s, %s --" %(type, description))

                tokenMap.pop(srctag)
            return dict 
 
        def parseReturn(tokenMap, dict):
            if const.RETURN in tokenMap:
                ret = tokenMap[const.RETURN][0]
                try:
                    # type, description = self.compound_pat.sub(compound_sub, ret)

                    match = self.compound_pat.match(ret)

                    if match:
                        if match.group(4):
                            type, description = "", unicode(match.group(4) + match.group(5), 'utf-8', 'xmlcharrefreplace')
                        else:
                            type, description = unicode(match.group(2), 'utf-8', 'xmlcharrefreplace'), unicode((match.group(1) + match.group(3)).strip(), 'utf-8', 'xmlcharrefreplace')
                    else:
                        type, description = "", ""

                except:
                    log.error("\nError, a return statement could not be parsed:\n\n %s\n\n %s\n" %(ret, pprint.pformat(tokenMap)))
                    sys.exit()

                dict[const.RETURN] = { const.TYPE: type , const.DESCRIPTION: description }
                tokenMap.pop(const.RETURN)
            return dict

        def defineClass(name):
            # log.info("\nDefine Class: " + name + ", " + self.currentModule)
            if self.currentNamespace:
                shortName, longName = self.getClassName(name, self.currentNamespace)
            else:
                shortName = longName = name
            c = { const.SHORTNAME: shortName, const.NAME: longName, const.NAMESPACE: self.currentNamespace }
            self.currentClass = longName
               
            if longName in self.data[const.CLASS_MAP]:
                # print "WARNING: %s - Class %s was redefined" %(tokens, longName)
                log.warn("WARNING: Class %s was redefined" %(longName))
            else:
                self.data[const.CLASS_MAP][longName] = c

            return shortName, longName 

        token = next()
        tokenMap = {}
        blockInfo = {}
        target = None
        currentFor = ""
        while token != None:
            if isTag(token):
                token = token[1:].lower() # remove the @ and lowercase
                desc = ""

                # most tags require a description after, some do not
                if token not in self.singleTags and not isTag(peek()):
                    desc = next()
                    if not desc or isTag(desc):
                        if desc:
                            msg = "WARNING: expected a description block for tag @%s but \
found another tag @%s" % (token, desc)
                        else:
                            msg = "WARNING: expected a description block for tag @%s but \
it was empty" % token

                        log.warn("\n" + self.currentFile + "\n" + msg + ":\n\n" + unicode(tokens) + "\n")




                # keep a map of the different tags we have found, with an
                # array to keep track of each occurrance
                if token not in tokenMap:
                    tokenMap[token] = []


                tokenMap[token].append(desc)

                # There are key pieces of info we need to have before we 
                # can properly set up the documemtation for this block
                if token == const.MODULE: 
                    if desc:

                        # log.info("\nModule: " + desc)
                        self.currentModule = desc
                    else:
                        log.warn('no name for module')

            else:
                # the first block without a description should be the description
                # for the block
                if token and const.DESCRIPTION not in tokenMap:

                    token = unicode(token, 'utf-8', 'xmlcharrefreplace')
                    # token.encode('utf-8', 'xmlcharrefreplace')
                    tokenMap[const.DESCRIPTION] = [token]
                else: pass # I don't think this can happen any longer

            token = next()

        self.blocks.append(tokenMap);
        
        if const.NAMESPACE in tokenMap:
            if not const.NAMESPACES in self.data: self.data[const.NAMESPACES] = []
            ns = tokenMap[const.NAMESPACE][0]
            self.currentNamespace = ns
            if ns not in self.data[const.NAMESPACES]:
                self.data[const.NAMESPACES].append(ns)
            tokenMap.pop(const.NAMESPACE)

        # @for tells the parser either that the class that is being parsed is an inner class
        # or, in the case of it being defined outside of a class definition, that an inner
        # class definition is complete and we need to resume processing the remainder of the
        # outer class
        if const.FOR in tokenMap:
            name = tokenMap[const.FOR][0]
            longName = name
            currentFor = longName
            if const.CLASS not in tokenMap:
                if longName in self.data[const.CLASS_MAP]:
                    self.currentClass = longName
                else:
                    defineClass(name)
                    
                tokenMap.pop(const.FOR)


        # use the guessed name and type if a block type was not found
        if const.CLASS not in tokenMap \
            and const.METHOD not in tokenMap \
            and const.PROPERTY not in tokenMap \
            and const.CONSTRUCTOR not in tokenMap \
            and const.EVENT not in tokenMap \
            and const.CONFIG not in tokenMap \
            and const.ATTRIBUTE not in tokenMap \
            and const.MODULE not in tokenMap:
            if const.GUESSEDNAME in tokenMap:
                if const.GUESSEDTYPE in tokenMap:
                    if tokenMap[const.GUESSEDTYPE][0] == const.FUNCTION:
                        tokenMap[const.METHOD] = tokenMap[const.GUESSEDNAME]
                    else:
                        tokenMap[const.PROPERTY] = tokenMap[const.GUESSEDNAME]


        
        # The following tokens represent the core type of comment blocks that are
        # supported.  It is possible to have a comment block that does not fall into
        # one of these core categories.  It is assumed that these blocks are supplying
        # global or contextual metadata

        def parseModule(tokenMap):

            log.info("\n\n%s:\n\n%s\n" %("tokenMap", unicode(tokenMap)))

            target = None
            self.subModName = False
            if not const.MODULES in self.data: self.data[const.MODULES] = {}
            for module in tokenMap[const.MODULE]:

                if module not in self.data[const.MODULES]:
                    self.data[const.MODULES][module] = { const.NAME: module, const.CLASS_LIST: [], const.FILE_LIST: [], const.SUBMODULES: [], const.SUBDATA: {} }

                target = self.data[const.MODULES][module]

            if const.SUBMODULE in tokenMap:
                target[const.SUBMODULES].append(tokenMap[const.SUBMODULE][0]);
                self.subModName = tokenMap[const.SUBMODULE][0];
                target[const.SUBDATA][self.subModName] = { const.NAME: self.currentClass }

                if const.DESCRIPTION in tokenMap:
                    target[const.SUBDATA][self.subModName][const.DESCRIPTION] = tokenMap[const.DESCRIPTION][0]
                    
                tokenMap.pop(const.SUBMODULE)
                
            elif const.DESCRIPTION in tokenMap:
                target[const.DESCRIPTION] = tokenMap[const.DESCRIPTION][0]

            if len(self.deferredModuleFiles) > 0:
                for i in self.deferredModuleFiles:
                    self.data[const.FILE_MAP][i][const.MODULE] = self.currentModule
                    self.data[const.MODULES][self.currentModule][const.FILE_LIST].append(i)

                self.deferredModuleFiles = []

            if len(self.deferredModuleClasses) > 0:
                for i in self.deferredModuleClasses:
                    self.data[const.CLASS_MAP][i][const.MODULE] = self.currentModule
                    self.data[const.MODULES][self.currentModule][const.CLASS_LIST].append(i)

                self.deferredModuleClasses = []

            tokenMap.pop(const.MODULE)

            return target, tokenMap

        if const.FILE_MARKER in tokenMap:
            if not const.FILE_MAP in self.data: self.data[const.FILE_MAP] = {}
            self.currentFile = desc
            file_name = tokenMap[const.FILE_MARKER][0]
            target = { const.NAME: file_name, const.CLASS_LIST:[] }
            self.data[const.FILE_MAP][file_name] = target

 
            if self.currentModule:
                target[const.MODULE] = self.currentModule
                self.data[const.MODULES][self.currentModule][const.FILE_LIST].append(file_name)
            else:
                """ defer the module assignment until we find the token """
                log.info('deferred module file: ' + file_name)
                self.deferredModuleFiles.append(file_name);


            tokenMap.pop(const.FILE_MARKER)

        elif const.CLASS in tokenMap:

            name = tokenMap[const.CLASS][0]

            shortName, longName = defineClass(name)

            if const.MODULE in tokenMap:
                target, tokenMap = parseModule(tokenMap)
            
            if self.subModName:
                self.data[const.MODULES][self.currentModule][const.SUBDATA][self.subModName][const.NAME] = longName
                if const.DESCRIPTION in tokenMap:
                    d = tokenMap[const.DESCRIPTION][0]
                    try: 
                        encoded = unicode(d, 'utf-8', 'xmlcharrefreplace')
                        d = encoded
                    except: pass
                    self.data[const.MODULES][self.currentModule][const.SUBDATA][self.subModName][const.DESCRIPTION] = d

            if const.GLOBAL in tokenMap:
                self.globals[longName] = True
                self.currentGlobal = longName

            target = self.data[const.CLASS_MAP][longName]

            if currentFor and currentFor != longName: # this is an inner class
                if "innerClasses" not in target:
                    target["innerClasses"] = []

                target["innerClasses"].append(currentFor)
 
            if self.currentModule:
                
                target[const.MODULE] = self.currentModule
                self.data[const.MODULES][self.currentModule][const.CLASS_LIST].append(longName)
            else:
                """ defer the module assignment until we find the token """
                log.info('deferred module CLASS: ' + longName)
                self.deferredModuleClasses.append(longName);

            if self.currentFile:
                target[const.FILE] = self.currentFile
                self.data[const.FILE_MAP][self.currentFile][const.CLASS_LIST].append(longName)

            # if "mixes" in tokenMap:
            if "extends" in tokenMap:
                # shortName, longName = self.getClassName(tokenMap["extends"][0], self.currentNamespace)
                longName = tokenMap["extends"][0]
                target["superclass"] = longName
                
            if "uses" in tokenMap:
                target["uses"] = []
                for i in tokenMap["uses"]:
                    # shortName, longName = self.getClassName(i, self.currentNamespace)
                    longName = i
                    target["uses"].append(longName)

            ###############
            # if not const.CLASS_LIST in self.data:
                # self.data[const.CLASS_LIST] = []

            # self.data[const.CLASS_LIST].append(target)
            ############
            
            tokenMap.pop(const.CLASS)
                
        elif const.METHOD in tokenMap:

            method = tokenMap[const.METHOD][0]

            if not self.currentClass:
                log.warn("WARNING: @method tag found before @class was found.\n****\n" + method + ", making global " + self.currentGlobal + " current class")
                self.currentClass = self.currentGlobal
                #sys.exit()
                # if const.FOR in tokenMap:
                    # self.currentClass = tokenMap[const.FOR][0]

            c = self.data[const.CLASS_MAP][self.currentClass]

            # log.info(" @method "  + method)

            if not const.METHODS in c: c[const.METHODS] = {}
            
            if method in c[const.METHODS]:
                log.warn("WARNING: method %s was redefined" %(method))
            else:
                c[const.METHODS][method] = parseParams(tokenMap, {})
                c[const.METHODS][method] = parseReturn(tokenMap, c[const.METHODS][method])

            target = c[const.METHODS][method]

            tokenMap.pop(const.METHOD)

        elif const.EVENT in tokenMap:
            if not self.currentClass:
                log.error("Error: @event tag found before @class was found.\n****\n")
                sys.exit()

            c = self.data[const.CLASS_MAP][self.currentClass]
            event = tokenMap[const.EVENT][0]

            if not const.EVENTS in c: c[const.EVENTS] = {}
            
            if event in c[const.EVENTS]:
                log.warn("WARNING: event %s was redefined" %(event))
            else:
                c[const.EVENTS][event] = parseParams(tokenMap, {})

            target = c[const.EVENTS][event]

            tokenMap.pop(const.EVENT)

        elif const.PROPERTY in tokenMap:

            if not self.currentClass:
                log.error("Error: @property tag found before @class was found.\n****\n")
                sys.exit()

            c = self.data[const.CLASS_MAP][self.currentClass]
            property = tokenMap[const.PROPERTY][0]

            if not const.PROPERTIES in c: c[const.PROPERTIES] = {}
            
            if property in c[const.PROPERTIES]:
                log.warn("WARNING: Property %s was redefined" %(property))
            else:
                c[const.PROPERTIES][property] = {}

            target = c[const.PROPERTIES][property]

            tokenMap.pop(const.PROPERTY)

        elif const.CONFIG in tokenMap or const.ATTRIBUTE in tokenMap:
        
            if not self.currentClass:
                log.error("Error: @config tag found before @class was found.\n****\n")
                sys.exit()

            c = self.data[const.CLASS_MAP][self.currentClass]
            if const.ATTRIBUTE in tokenMap:
                config = tokenMap[const.ATTRIBUTE][0]
            else:
                config = tokenMap[const.CONFIG][0]


            if not const.CONFIGS in c: c[const.CONFIGS] = {}
            
            if config in c[const.CONFIGS]:
                log.warn("WARNING: Property %s was redefined" %(config))
            else:
                c[const.CONFIGS][config] = {}

            target = c[const.CONFIGS][config]

            if const.ATTRIBUTE in tokenMap:
                tokenMap.pop(const.ATTRIBUTE)

                if not const.EVENTS in c: c[const.EVENTS] = {}

                def getAttEvt(eventname, desc):

                    return {
                        const.NAME: eventname,
                        const.DESCRIPTION: desc,
                        const.PARAMS: [{
                            const.NAME: const.EVENT,
                            const.TYPE: "{oldValue: any, newValue: any}",
                            const.DESCRIPTION: "An object containing the previous attribute value and the new value."
                        }]
                    }

                def get3xAttEvt(eventname, config):

                    return {
                        const.NAME: eventname,
                        const.DESCRIPTION: 'Fires when the value for the configuration attribute \'%s\' is \
changed. You can listen for the event using the <a href="Attribute.html#method_on">on</a> \
method if you wish to be notified before the attribute\'s value has changed, or using the \
<a href="Event.Target.html#method_after">after</a> method if you wish to be notified after \
the attribute\'s value has changed.' %(config),
                        const.PARAMS: [{
                            const.NAME: const.EVENT,
                            const.TYPE: "Event.Facade",
                            const.DESCRIPTION: 'An Event Facade object with \
     the following attribute specific properties added:\
	<dl>\
		<dt>prevVal</dt>\
		<dd>The value of the attribute, prior to it being set</dd>\
		<dt>newVal</dt>\
		<dd>The value the attribute is to be set to</dd>\
		<dt>attrName</dt>\
		<dd>The name of the attribute being set</dd>\
		<dt>subAttrName</dt>\
		<dd>If setting a property within the attribute\'s value,\
           the name of the sub-attribute property being set</dd>\
	</dl>'
                        }]
                    }

                # auto-document '[configname]ChangeEvent' and 'before[Configname]ChangeEvent'
                if self.data[const.MAJOR_VERSION] > 2:

                    eventname = config + const.CHANGEEVENT
                    c[const.EVENTS][eventname] = get3xAttEvt(eventname, config)

                else:

                    eventname = config + const.CHANGEEVENT
                    desc = "Fires when the value for the configuration attribute '" + config + "' changes."
                    c[const.EVENTS][eventname] = getAttEvt(eventname, desc)

                    eventname = const.BEFORE + config[0].upper() + config[1:] + const.CHANGEEVENT
                    desc = "Fires before the value for the configuration attribute '" + config + "' changes." + " Return false to cancel the attribute change."
                    c[const.EVENTS][eventname] = getAttEvt(eventname, desc)

                
            else:
                tokenMap.pop(const.CONFIG)

        # module blocks won't be picked up unless they are standalone
        elif const.MODULE in tokenMap:
            target, tokenMap = parseModule(tokenMap)

        else:
            msg = "WARNING: doc block type ambiguous, no @class, @module, @method, \
@event, @property, or @config tag found.  This block may be skipped"
            log.warn("\n" + self.currentFile + "\n" + msg + ":\n\n" + unicode(tokens) + "\n")

        # constructors are added as an array to the currentClass.  This makes it so
        # multiple constructors can be supported even though that is out of scope
        # for documenting javascript
        if const.CONSTRUCTOR in tokenMap:

            if not self.currentClass:
                log.error("Error: @constructor tag found but @class was not found.\n****\n")
                sys.exit(1)

            c = self.data[const.CLASS_MAP][self.currentClass]
            if not const.CONSTRUCTORS in c: c[const.CONSTRUCTORS] = []
            constructor = parseParams(tokenMap, { const.DESCRIPTION: tokenMap[const.DESCRIPTION][0] })
            c[const.CONSTRUCTORS].append(constructor)
            tokenMap.pop(const.CONSTRUCTOR)

        # process the rest of the tags
        if target != None:
            for token in tokenMap:
                if token not in target:
                    target[token] = tokenMap[token][0]

def main():
    optparser = OptionParser("usage: %prog [options] inputdir1 inputdir2 etc")
    optparser.set_defaults(outputdir="out",
                           outputfile="parsed.json", 
                           extension=".js",
                           version=""
                           )
    optparser.add_option( "-o", "--outputdir",
                          action="store", dest="outputdir", type="string",
                          help="Directory to write the parser results" )
    optparser.add_option( "-f", "--file",
                          action="store", dest="outputfile", type="string",
                          help="The name of the file to write the JSON output" )
    optparser.add_option( "-e", "--extension",
                          action="store", dest="extension", type="string",
                          help="The extension for the files that should be parsed" )
    optparser.add_option( "-v", "--version",
                          action="store", dest="version", type="string",
                          help="The version of the project" )
    (opts, inputdirs) = optparser.parse_args()
    if len(inputdirs) > 0:
        docparser = DocParser( inputdirs, 
                            opts.outputdir, 
                            opts.outputfile, 
                            opts.extension,
                            opts.version
                            )
    else:
        optparser.error("Incorrect number of arguments")
           
if __name__ == '__main__':
    main()
