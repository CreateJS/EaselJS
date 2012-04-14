#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sw=4 ts=4

'''
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.html
version: 1.0.0b1
'''

''' Prints documentation with htmltmpl from the json data outputted by parser.py  ''' 
import os, re, shutil, logging, logging.config, time, datetime
import json as simplejson
import const
from cStringIO import StringIO 
from Cheetah.Template import Template
from sets import Set

try:
    logging.config.fileConfig(os.path.join(sys.path[0], const.LOGCONFIG))
except:
    pass

log = logging.getLogger('yuidoc.generate')


class DocGenerator(object):

    def __init__(self, inpath, datafile, outpath, templatepath, newext, showprivate=False, 
                 projectname='Yahoo! UI Library', 
                 version='', 
                 projecturl='http://developer.yahoo.com/yui/', 
                 ydn=False):

        def _mkdir(newdir):
            if os.path.isdir(newdir): pass
            elif os.path.isfile(newdir):
                raise OSError("a file with the same name as the desired " \
                              "dir, '%s', already exists." % newdir)
            else:
                head, tail = os.path.split(newdir)
                if head and not os.path.isdir(head): _mkdir(head)
                if tail: os.mkdir(newdir)

       
        self.moduleprefix = const.MODULE_PREFIX
        self.inpath       = os.path.abspath(inpath)

        # set and output path, create if needed
        self.outpath      = os.path.abspath(outpath)
        self.newext = newext
        _mkdir(self.outpath)

        self.templatepath = os.path.abspath(templatepath)

        # copy all of the directories from the template directory to the
        # destination directory.
        for i in os.listdir(self.templatepath):
            fullname = os.path.join(self.templatepath, i)
            if os.path.isdir(fullname):
                targetdir = os.path.join(self.outpath, i)
                try:
                    shutil.rmtree(targetdir)
                except: pass
                shutil.copytree(fullname, targetdir)


        self.showprivate  = showprivate

        f=open(os.path.join(inpath, datafile))
        self.rawdata = StringIO(f.read()).getvalue()
        d = self.data = simplejson.loads(self.rawdata)

        self.projectname = projectname
        self.projecturl = projecturl
        self.ydn = ydn
        self.version = version 
        self.modulename  = ""
        self.moduletitle  = ""
        self.moduledesc  = "Please supply a module block somewhere in your code"
        # self.requires    = None
        self.modules = d[const.MODULES]
        self.modulenames = self.modules.keys()
        self.modulenames.sort(lambda x,y: cmp(x.lower(), y.lower()))

        self.cleansedmodulename = self.cleanseStr(self.modulename)
    
        self.classname   = ""
        self.filename    = ""
        self.pagetype    = ""
        self.classmap    = d[const.CLASS_MAP]
        self.classnames  = ""
        self.filenames   = ""
        self.allprops = []

    def cleanseStr(self, strg):
        cleanregex= re.compile(r"[^\w\-]")
        cleansed = cleanregex.sub('', strg.lower())
        # log.warn('cleansed module: %s' %(cleansed));
        return self.moduleprefix + cleansed

    def write(self, filename, data):
        out = open(os.path.join(self.outpath, filename), "w")
        out.writelines(str(data))
        out.close()

    def process(self):

        def assignGlobalProperties(template):
            template.projectname  = self.projectname
            template.projecturl   = self.projecturl
            template.ydn          = self.ydn
            template.version      = self.version
            template.modules      = self.modules
            template.modulenames  = self.modulenames
            template.modulename   = self.modulename
            template.moduletitle = self.moduletitle
            template.cleansedmodulename = self.cleansedmodulename 
            template.moduledesc   = self.moduledesc

            template.year         = datetime.date.today().strftime('%Y')

            template.filename     = self.filename
            if self.filename:
                template.filepath = os.path.join(self.inpath, self.filename)
                template.filepath_highlighted = template.filepath + self.newext

            template.pagetype     = self.pagetype
            template.classmap     = self.classmap
            template.classnames   = self.classnames
            template.filenames    = self.filenames
            template.classname    = self.classname
            template.requires     = ""
            template.optional     = ""
            template.properties = ""
            template.methods = ""
            template.events  = ""
            template.configs = ""
            template.extends = ""
            template.uses   = ""
            template.index = False # is this the index page

        def transferToTemplate(prop, dict, template, valOverride=''):
            val = ""
            if prop in dict:
                val = unicode(dict[prop])

                if valOverride:
                    val = valOverride

            setattr(template, prop, val)

        def transferToDict(prop, dict1, dict2, default="", skipOverrideIfNoMatch=False):
            val = "" 
            if prop in dict1:
                val = unicode(dict1[prop])
                if not val: 
                    val = default
            else:
                if skipOverrideIfNoMatch:
                    pass
                else:
                    val = default

            dict2[prop] = val

        def shouldShow(item):
            if const.STATIC not in item and \
                    (self.showprivate or const.PRIVATE not in item):
                return True
            else:
                 return False

        def shouldShowClass(item):
            if self.showprivate or const.PRIVATE not in item:
                return True
            else:
                return False

        def soft_sort(x, y):
            return cmp(x.lower(), y.lower())


        def getPropsFromSuperclass(superc, classes, dict):
            # get inherited data
            if shouldShowClass(superc):
                supercname = superc[const.NAME]
                if const.PROPERTIES in superc:
                    inhdef = dict[const.PROPERTIES][supercname] = []
                    keys = superc[const.PROPERTIES].keys()
                    keys.sort(soft_sort)
                    for prop in keys:
                        superprop = superc[const.PROPERTIES][prop]
                        if shouldShow(superprop):
                            if const.PRIVATE in superprop: access = const.PRIVATE
                            elif const.PROTECTED in superprop: access = const.PROTECTED
                            else:access = ""
                            inhdef.append({const.NAME: prop, const.ACCESS: access, const.DEPRECATED: const.DEPRECATED in superprop})
                if const.METHODS in superc:
                    inhdef = dict[const.METHODS][supercname] = []
                    keys = superc[const.METHODS].keys()
                    keys.sort(soft_sort)
                    for method in keys:
                        supermethod = superc[const.METHODS][method]
                        if shouldShow(supermethod):
                            if const.PRIVATE in supermethod: access = const.PRIVATE
                            elif const.PROTECTED in supermethod: access = const.PROTECTED
                            else:access = ""
                            inhdef.append({const.NAME: method, const.ACCESS: access, const.DEPRECATED: const.DEPRECATED in supermethod})
                if const.EVENTS in superc:
                    inhdef = dict[const.EVENTS][supercname] = []
                    keys = superc[const.EVENTS].keys()
                    keys.sort(soft_sort)
                    for event in keys:
                        superevent = superc[const.EVENTS][event]
                        if shouldShow(superevent):
                            # inhdef.append(event)
                            if const.PRIVATE in superevent: access = const.PRIVATE
                            elif const.PROTECTED in superevent: access = const.PROTECTED
                            else:access = ""
                            inhdef.append({const.NAME: event, const.ACCESS: access, const.DEPRECATED: const.DEPRECATED in superevent})
                if const.CONFIGS in superc:
                    inhdef = dict[const.CONFIGS][supercname] = []
                    keys = superc[const.CONFIGS].keys()
                    keys.sort(soft_sort)
                    for config in keys:
                        superconfig = superc[const.CONFIGS][config]
                        if shouldShow(superconfig):
                            #inhdef.append(config)
                            if const.PRIVATE in superconfig: access = const.PRIVATE
                            elif const.PROTECTED in superconfig: access = const.PROTECTED
                            else:access = ""
                            inhdef.append({const.NAME: config, const.ACCESS: access, const.DEPRECATED: const.DEPRECATED in superconfig})

                if const.EXTENDS in superc:
                    supercname = superc[const.EXTENDS]
                    if supercname in classes:
                        getPropsFromSuperclass(classes[supercname], classes, dict)

                if const.USES in superc:
                    for supercname in superc[const.USES]:
                        if supercname in classes:
                            getPropsFromSuperclass(classes[supercname], classes, dict)

        # build url: class, property, type
        def getUrl(c, p, t=''):
            return "%s.html#%s_%s" %(c, t, p)

        #sort is case insensitive and ignores puctuation for the search json file
        def allprop_sort(x, y):
            pat = re.compile(r"[\_\-\.]")
            cx = x[const.NAME].lower()
            cy = y[const.NAME].lower()
            cx = pat.sub('', cx)
            cy = pat.sub('', cy)
            return cmp(cx, cy)

        log.info("-------------------------------------------------------")
 
        # copy the json file
        # jsonname = self.cleansedmodulename + ".json"
        jsonname = "raw.json"
        log.info("Writing " + jsonname)
        self.write(jsonname, self.rawdata)

        for mname in self.modules:
            log.info("Generating module splash for %s" %(mname))

            m = self.modules[mname]
            self.filename   = ""
            self.classname   = ""
            classes = self.data[const.CLASS_MAP]
            self.classnames = []

            for i in m[const.CLASS_LIST]:
                if shouldShowClass(classes[i]):
                    self.classnames.append(i)

            self.classnames.sort(soft_sort)

            t = Template(file=os.path.join(self.templatepath, "main.tmpl"))
            t.timestamp = time.time()

            self.modulename   = mname
            self.moduletitle = mname
            if const.TITLE in m:
                self.moduletitle = m[const.TITLE]
            self.cleansedmodulename = self.cleanseStr(mname)

            if const.DESCRIPTION in m:
                self.moduledesc   = m[const.DESCRIPTION]
            else: 
                log.warn("Missing module description for " + mname)
                self.moduledesc   = ''

            self.filenames = m[const.FILE_LIST]
            self.filenames.sort(soft_sort)

            assignGlobalProperties(t)

            transferToTemplate(const.REQUIRES, m, t)
            transferToTemplate(const.OPTIONAL, m, t)

            transferToTemplate(const.BETA, m, t, "Beta")
            transferToTemplate(const.EXPERIMENTAL, m, t, "Experimental")
            
            if len(m[const.SUBMODULES]) > 0:
                strg = ', '.join(m[const.SUBMODULES])
            else:
                strg = 'none'
                
            transferToTemplate(const.SUBMODULES, m, t, strg)
            t.submodules = m[const.SUBMODULES]

            transferToTemplate(const.SUBDATA, m, t, '')
            t.subdata = m[const.SUBDATA]


            moduleprops = []
            classList = []

            # class API view
            #for i in classes:
            for i in m[const.CLASS_LIST]:
                self.classname = unicode(i)
                c = classes[i]
                if shouldShowClass(c):
                    log.info("Generating API page for " + i)
                    assignGlobalProperties(t)

                    # template items that need default vaules even if not included
                    transferToTemplate( const.SEE, c, t )
                    transferToTemplate( const.DEPRECATED, c, t )
                    transferToTemplate( const.DESCRIPTION, c, t )
                    transferToTemplate( const.STATIC, c, t )
                    if const.STATIC in c: t.static = const.STATIC
                    transferToTemplate( const.FINAL, c, t )
                    if const.FINAL in c: t.final = const.FINAL
                    transferToTemplate( const.ACCESS, c, t )
                    if const.PRIVATE in c: t.access = const.PRIVATE
                    elif const.PROTECTED in c: t.access = const.PROTECTED

                    desc = ''
                    if const.DESCRIPTION in c:
                        desc = c[const.DESCRIPTION]


                    #subclasses
                    subclasses = self.subclasses = []
                    for j in classes:
                        if const.SUPERCLASS in classes[j] and classes[j][const.SUPERCLASS] == i:
                            subclasses.append(j)

                    t.subclasses = subclasses

                    gName = i.replace('YAHOO.widget.', '');
                    gName = gName.replace('YAHOO.util.', '');
                    classInfo = { const.DESCRIPTION: desc, const.NAME: i, const.GUESSEDNAME: gName, const.EXTENDS: [] }


                    # Properties/fields
                    props = t.properties = []
                    if const.PROPERTIES in c:
                        keys = c[const.PROPERTIES].keys()
                        keys.sort(soft_sort)
                        for propertykey in keys:
                            prop     = c[const.PROPERTIES][propertykey]
                            if self.showprivate or const.PRIVATE not in prop:
                                propdata = {const.NAME: propertykey, const.HOST: i, const.TYPE: 'property', const.URL:getUrl(i, propertykey, const.PROPERTY)}

                                transferToDict( const.ACCESS,   prop, propdata           )
                                if const.PRIVATE in prop: propdata[const.ACCESS] = const.PRIVATE
                                elif const.PROTECTED in prop: propdata[const.ACCESS] = const.PROTECTED

                                self.allprops.append(propdata.copy())
                                moduleprops.append(propdata.copy())

                                transferToDict( const.TYPE,        prop, propdata, const.OBJECT )
                                transferToDict( const.DESCRIPTION, prop, propdata           )
                                transferToDict( const.DEFAULT,     prop, propdata           )
                                transferToDict( const.DEPRECATED,  prop, propdata, const.NBWS, const.DEPRECATED )
                                transferToDict( const.SEE,         prop, propdata           )
                                transferToDict( const.STATIC,      prop, propdata           )
                                if const.STATIC in prop: propdata[const.STATIC] = const.STATIC
                                transferToDict( const.FINAL,      prop, propdata           )
                                if const.FINAL in prop: propdata[const.FINAL] = const.FINAL
                                props.append(propdata)

                    # Methods
                    methods = t.methods = []
                    if const.METHODS in c:
                        keys = c[const.METHODS].keys()
                        keys.sort(soft_sort)
                        for methodkey in keys:
                            method = c[const.METHODS][methodkey]
                            if self.showprivate or const.PRIVATE not in method:
                                methoddata = {const.NAME: methodkey, const.HOST: i, const.TYPE: 'method', const.URL:getUrl(i, methodkey, const.METHOD)}

                                transferToDict( const.ACCESS,      method, methoddata )
                                if const.PRIVATE in method: methoddata[const.ACCESS] = const.PRIVATE
                                elif const.PROTECTED in method: methoddata[const.ACCESS] = const.PROTECTED

                                self.allprops.append(methoddata.copy())
                                moduleprops.append(methoddata.copy())

                                transferToDict( const.DESCRIPTION, method, methoddata )
                                transferToDict( const.DEPRECATED,  method, methoddata, const.NBWS, const.DEPRECATED )
                                transferToDict( const.SEE,         method, methoddata )
                                transferToDict( const.STATIC,      method, methoddata )
                                if const.STATIC in method: methoddata[const.STATIC] = const.STATIC
                                transferToDict( const.FINAL,      method, methoddata )
                                if const.FINAL in method: methoddata[const.FINAL] = const.FINAL

                                transferToDict( const.CHAINABLE,      method, methoddata )
                                if const.CHAINABLE in method: methoddata[const.CHAINABLE] = const.CHAINABLE

                                ret = methoddata[const.RETURN] = {const.NAME:"", const.DESCRIPTION:"", const.TYPE:const.VOID}
                                if const.RETURN in method:
                                    transferToDict( const.TYPE,        method[const.RETURN], ret, "" )
                                    transferToDict( const.DESCRIPTION, method[const.RETURN], ret )
                                    
                                params = methoddata[const.PARAMS] = []
                                if const.PARAMS in method:
                                    mp = method[const.PARAMS]
                                    for p in mp:
                                        param = {}
                                        transferToDict( const.NAME,        p, param, const.UNKNOWN )
                                        transferToDict( const.TYPE,        p, param, const.OBJECT )
                                        transferToDict( const.DESCRIPTION, p, param )
                                        params.append(param)

                                methods.append(methoddata)

                    # Events
                    events = t.events = []
                    if const.EVENTS in c:
                        keys = c[const.EVENTS].keys()
                        keys.sort(soft_sort)
                        for eventkey in keys:
                            event = c[const.EVENTS][eventkey]
                            if self.showprivate or const.PRIVATE not in event:
                                eventdata = {const.NAME: eventkey, const.HOST: i, const.TYPE: 'event', const.URL:getUrl(i, eventkey, const.EVENT)}

                                transferToDict( const.ACCESS,      event, eventdata )
                                if const.PRIVATE in event: eventdata[const.ACCESS] = const.PRIVATE
                                elif const.PROTECTED in event: eventdata[const.ACCESS] = const.PROTECTED

                                self.allprops.append(eventdata.copy())
                                moduleprops.append(eventdata.copy())

                                transferToDict( const.DESCRIPTION, event, eventdata )
                                transferToDict( const.DEPRECATED,  event, eventdata, const.NBWS, const.DEPRECATED )
                                transferToDict( const.SEE,         event, eventdata )
                                transferToDict( const.STATIC,      event, eventdata )
                                if const.STATIC in event: eventdata[const.STATIC] = const.STATIC
                                transferToDict( const.FINAL,      event, eventdata )
                                if const.FINAL in event: eventdata[const.FINAL] = const.FINAL

                                transferToDict( const.BUBBLES,      event, eventdata )
                                if const.BUBBLES in event: eventdata[const.BUBBLES] = const.BUBBLES

                                transferToDict( const.PREVENTABLE,      event, eventdata )
                                if const.PREVENTABLE in event: eventdata[const.PREVENTABLE] = const.PREVENTABLE

                                transferToDict( const.CANCELABLE,      event, eventdata )
                                if const.CANCELABLE in event: eventdata[const.CANCELABLE] = const.CANCELABLE



                                params = eventdata[const.PARAMS] = []
                                if const.PARAMS in event:
                                    mp = event[const.PARAMS]
                                    for p in mp:
                                        param = {}
                                        transferToDict( const.NAME,        p, param, const.UNKNOWN )
                                        transferToDict( const.TYPE,        p, param, const.OBJECT )
                                        transferToDict( const.DESCRIPTION, p, param )
                                        params.append(param)

                                events.append(eventdata)

                    # configs
                    configs = t.configs = []
                    if const.CONFIGS in c:
                        keys = c[const.CONFIGS].keys()
                        keys.sort(soft_sort)
                        for configkey in keys:
                            config = c[const.CONFIGS][configkey]
                            if self.showprivate or const.PRIVATE not in config:
                                configdata = {const.NAME: configkey, const.HOST: i, const.TYPE: 'config', const.URL:getUrl(i, configkey, const.CONFIG)}

                                transferToDict( const.ACCESS,   config, configdata           )
                                if const.PRIVATE in config: configdata[const.ACCESS] = const.PRIVATE
                                elif const.PROTECTED in config: configdata[const.ACCESS] = const.PROTECTED

                                self.allprops.append(configdata.copy())
                                moduleprops.append(configdata.copy())

                                transferToDict( const.TYPE,        config, configdata, const.OBJECT )
                                transferToDict( const.DESCRIPTION, config, configdata           )
                                transferToDict( const.DEFAULT, config, configdata           )
                                transferToDict( const.DEPRECATED,  config, configdata, const.NBWS, const.DEPRECATED )
                                transferToDict( const.SEE,         config, configdata           )
                                transferToDict( const.STATIC,      config, configdata           )
                                if const.STATIC in config: configdata[const.STATIC] = const.STATIC
                                transferToDict( const.FINAL,      config, configdata           )
                                if const.FINAL in config: configdata[const.FINAL] = const.READONLY
                                transferToDict( const.WRITEONCE,      config, configdata           )
                                if const.WRITEONCE in config: configdata[const.WRITEONCE] = const.WRITEONCE
                                configs.append(configdata)

                    # get inherited data
                    inherited = t.inherited = {const.PROPERTIES:{}, const.METHODS:{}, const.EVENTS:{}, const.CONFIGS:{}, const.SUPERCLASS: {} }
                    if const.EXTENDS in c:
                        supercname = t.extends = unicode(c[const.EXTENDS])
                        if supercname in classes:
                            superc = classes[supercname]
                            getPropsFromSuperclass(superc, classes, inherited)

                    if const.USES in c:
                        for supercname in c[const.USES]:
                            t.uses = c[const.USES]
                            if supercname in classes:
                                superc = classes[supercname]
                                getPropsFromSuperclass(superc, classes, inherited)
                    
                    #Create the superclass chain and attach it to the classInfo Object
                    extends = {}
                    for i in inherited:
                        for a in inherited[i]:
                            extends[a] = a
                    
                    inherited[const.SUPERCLASS] = extends
                    classInfo[const.EXTENDS] = inherited
                    classList.append(classInfo)

                    # Constructor -- technically the parser can take multiple constructors
                    # but that does't help here
                    constructordata = t.constructor = {}
                    if const.CONSTRUCTORS in c:
                        constructor = c[const.CONSTRUCTORS][0]
                        transferToDict( const.DESCRIPTION, constructor, constructordata )
                        ret = constructordata[const.RETURN] = {}
                        if const.RETURN in constructor:
                            transferToDict( const.TYPE,        constructor[const.RETURN], ret, const.VOID )
                            transferToDict( const.DESCRIPTION, constructor[const.RETURN], ret )
                            
                        params = constructordata[const.PARAMS] = []
                        if const.PARAMS in constructor:
                            cp = constructor[const.PARAMS]
                            for p in cp:
                                param = {}
                                transferToDict( const.NAME,        p, param, const.UNKNOWN )
                                transferToDict( const.TYPE,        p, param, const.OBJECT )
                                transferToDict( const.DESCRIPTION, p, param )
                                params.append(param)


                    # write module splash
                    moduleprops.sort(allprop_sort)
                    t.allprops_raw = moduleprops
                    moduleprops_json =  simplejson.dumps(moduleprops)
                    t.allprops = moduleprops_json
                    classList.sort(allprop_sort)
                    t.classList_raw = classList
                    t.classList = simplejson.dumps(classList)
                    self.write("%s.html" %(self.classname), t)
        
            # clear out class name
            self.classname   = ""
            t.classname = ""
            t.filename = ""
            t.properties = ""
            t.methods = ""
            t.events  = ""
            t.configs = ""


            # write module splash
            moduleprops.sort(allprop_sort)
            t.allprops_raw = moduleprops
            moduleprops_json =  simplejson.dumps(moduleprops)
            t.allprops = moduleprops_json

            # log.warn('cleansed module file name: %s' %(t.cleansedmodulename));
            self.write( t.cleansedmodulename + ".html", t)


            # class source view
            for i in m[const.FILE_LIST]:
                log.info("Generating source view for " + i)
                self.filename = unicode(i)
                assignGlobalProperties(t)
                self.write("%s.html" %(self.filename), t)


        #remove dups
        allprops = []
        propmap = {}
        for i in self.allprops:
            url = i[const.URL]
            if url not in propmap:
                allprops.append(i)
                propmap[url] = True

        allprops.sort(allprop_sort)
                                            
        allprops_json =  simplejson.dumps(allprops)
        self.write("index.json",allprops_json)

        # index
        log.info("Generating index")
        t = Template(file=os.path.join(self.templatepath, "main.tmpl"))
        t.timestamp = time.time()
        self.modulename   = ""
        self.moduletitle = ""
        self.classname   = ""
        self.classnames = []

        for i in self.data[const.CLASS_MAP].keys():
            if shouldShowClass(self.data[const.CLASS_MAP][i]):
                self.classnames.append(i)
        self.classnames.sort(soft_sort)

        self.filenames  = self.data[const.FILE_MAP].keys()
        self.filenames.sort(soft_sort)
        self.filename   = ""
        assignGlobalProperties(t)
        t.allprops = allprops_json
        t.index = True
        self.write("index.html", t)


        # map all classes to the corresponding module for external loaders
        t = Template(file=os.path.join(self.templatepath, "classmap.tmpl"))
        t.timestamp = time.time()
        pkgMap = {}
        keys = self.data[const.CLASS_MAP].keys()
        keys.sort()
        for i in keys:

            try:
                pkgMap[i] = self.data[const.CLASS_MAP][i][const.MODULE]
            except:
                try:
                    log.warn('class map ' + i + ' failure (no module declaration?)')
                except: pass

        t.pkgmap = simplejson.dumps(pkgMap)
        self.write("classmap.js", t)


        log.info(" ")
        log.info("Done\n")


def main():
    from optparse import OptionParser
    optparser = OptionParser("usage: %prog inputdir [options] inputdir")
    optparser.set_defaults(outputdir="docs", 
                           inputfile="parsed.json", 
                           newext=".highlighted", 
                           showprivate=False,
                           project="Yahoo! UI Library",
                           version=""
                           )
    optparser.add_option( "-o", "--outputdir",
        action="store", dest="outputdir", type="string",
        help="Directory to write the html documentation" )
    optparser.add_option( "-f", "--file",
        action="store", dest="inputfile", type="string",
        help="The name of the file that contains the JSON doc info" )
    optparser.add_option( "-t", "--template",
        action="store", dest="templatedir", type="string",
        help="The directory containing the html tmplate" )
    optparser.add_option( "-c", "--crosslink",
        action="store", dest="crosslinkdir", type="string",
        help="The directory containing json data for other modules to crosslink" )
    optparser.add_option( "-s", "--showprivate",
        action="store_true", dest="showprivate",
        help="Should private properties/methods be in the docs?" )
    optparser.add_option( "-n", "--newextension",
                          action="store", dest="newext", type="string",
                          help="The extension to append to the syntax output file" )
    optparser.add_option( "-m", "--project",
                          action="store", dest="project", type="string",
                          help="The name of the project" )
    optparser.add_option( "-v", "--version",
                          action="store", dest="version", type="string",
                          help="The version of the project" )

    optparser.add_option( "-u", "--projecturl",
                          action="store", dest="projecturl", type="string",
                          help="The project url" )
    optparser.add_option( "-y", "--ydn",
        action="store_true", dest="ydn",
        help="Add YDN MyBlogLog intrumentation?" )


    (options, inputdirs) = optparser.parse_args()

    if len(inputdirs) > 0:
        generator = DocGenerator( inputdirs[0], 
                               options.inputfile, 
                               options.outputdir,
                               options.templatedir,
                               options.showprivate,
                               options.project,
                               options.version,
                               options.projecturl,
                               options.ydn
                               )
        generator.process()
    else:
        optparser.error("Incorrect number of arguments")
           
if __name__ == '__main__':
    main()

