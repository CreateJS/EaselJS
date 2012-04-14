#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sw=4 ts=4

'''
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.html
version: 1.0.0b1
'''

import yuidoc_parse, yuidoc_highlight, yuidoc_generate

def main():
    from optparse import OptionParser
    optparser = OptionParser("usage: %prog inputdir [options] inputdir")
    optparser.set_defaults(extension=".js", 
                           newext=".highlighted", 
                           parseroutdir="/tmp", 
                           outputdir="docs", 
                           parserfile="parsed.json", 
                           showprivate=False,
                           project="Yahoo! UI Library",
                           version="",
                           projecturl="http://developer.yahoo.com/yui/",
                           yuiversion=False,
                           ydn=False
                           )
    optparser.add_option( "-p", "--parseroutdir",
        action="store", dest="parseroutdir", type="string",
        help="Directory to write the parser temp data" )
    optparser.add_option( "-o", "--outputdir",
        action="store", dest="outputdir", type="string",
        help="Directory to write the html documentation" )
    optparser.add_option( "-f", "--file",
        action="store", dest="parserfile", type="string",
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
    optparser.add_option( "-e", "--extension",
                          action="store", dest="extension", type="string",
                          help="The extension to parse" )
    optparser.add_option( "-n", "--newextension",
                          action="store", dest="newext", type="string",
                          help="The extension to append to the yuisyntax highlighted output file" )
    optparser.add_option( "-m", "--project",
                          action="store", dest="project", type="string",
                          help="The name of the project" )
    optparser.add_option( "-v", "--version",
                          action="store", dest="version", type="string",
                          help="The version of the project" )

    optparser.add_option( "-u", "--projecturl",
                          action="store", dest="projecturl", type="string",
                          help="The project url" )

    optparser.add_option( "-Y", "--yuiversion",
                          action="store", dest="yuiversion", type="string",
                          help="The version of YUI library used in the project.  This parameter applies to the output for attributes, which differs between YUI2 and YUI3." )

    optparser.add_option( "-y", "--ydn",
        action="store_true", dest="ydn",
        help="Add YDN MyBlogLog intrumentation?" )

    (opts, inputdirs) = optparser.parse_args()

    if len(inputdirs) > 0:
        docparser = yuidoc_parse.DocParser( inputdirs, 
                            opts.parseroutdir, 
                            opts.parserfile, 
                            opts.extension,
                            opts.version,
                            opts.yuiversion
                            )

        highlighter = yuidoc_highlight.DocHighlighter( [opts.parseroutdir], 
                            opts.parseroutdir, 
                            opts.extension,
                            opts.newext )

        gen = yuidoc_generate.DocGenerator( opts.parseroutdir, 
                               opts.parserfile, 
                               opts.outputdir,
                               opts.templatedir,
                               opts.newext,
                               opts.showprivate,
                               opts.project,
                               opts.version,
                               opts.projecturl,
                               opts.ydn
                               )
        gen.process()
    else:
        optparser.error("Incorrect number of arguments")
           
if __name__ == '__main__':
    main()

