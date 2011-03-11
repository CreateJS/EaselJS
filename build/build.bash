#!/bin/bash

if [ -z $1 ];then
	echo "Usage: ./build.bash path-to-compiler.jar"
	exit 0
fi

OUTPUT_DIR=output

if [ ! -d $OUTPUT_DIR ];then
	mkdir $OUTPUT_DIR
fi

OUTPUT=$OUTPUT_DIR/tmp.js
FINAL=$OUTPUT_DIR/easel.js

if [ -e $FINAL ];then
	rm $FINAL
fi

export js_params=`find ../src -name *.js -exec echo '--js {}' \; | xargs`
java -jar $1 $js_params --js_output_file $OUTPUT

cat license.txt >> $FINAL
cat $OUTPUT >> $FINAL

rm $OUTPUT