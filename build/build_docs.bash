#!/bin/bash

if [ -z $2 ];then
	echo "Usage: ./build_docs.bash path-to-yuidoc.py build_version"
	exit 0
fi


# The location of your yuidoc install
#yuidoc_home=/Users/mesh/Downloads/yuidoc

yuidoc_exe=$1

# The location of the files to parse.  Parses subdirectories, but will fail if
# there are duplicate file names in these directories.  You can specify multiple
# source trees:
#     parser_in="%HOME/www/yui/src %HOME/www/event/src"
parser_in="../src"

# The location to output the parser data.  This output is a file containing a 
# json string, and copies of the parsed files.
parser_out=tmp/parser

# The directory to put the html file outputted by the generator
generator_out=output/docs

# The location of the template files.  Any subdirectories here will be copied
# verbatim to the destination directory.
template=template

# The version of your project to display within the documentation.
version=$2

# The version of YUI the project is using.  This effects the output for
# YUI configuration attributes.  This should start with '2' or '3'.
yuiversion=2

projectname="EaselJS"

##############################################################################
# add -s to the end of the line to show items marked private

#projectname

$yuidoc_exe $parser_in -p $parser_out -o $generator_out -t $template -v $version -Y $yuiversion -m $projectname -u "http://www.easeljs.com"

rm -r tmp