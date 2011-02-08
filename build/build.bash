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

java -jar $1 --js ../src/easeljs/utils/UID.js --js ../src/easeljs/utils/Ticker.js --js ../src/easeljs/events/MouseEvent.js --js ../src/easeljs/geom/Matrix2D.js --js ../src/easeljs/geom/Point.js --js ../src/easeljs/geom/Rectangle.js --js ../src/easeljs/display/Shadow.js --js ../src/easeljs/display/SpriteSheet.js --js ../src/easeljs/display/Graphics.js --js ../src/easeljs/display/DisplayObject.js --js ../src/easeljs/display/Container.js --js ../src/easeljs/display/Stage.js --js ../src/easeljs/display/Bitmap.js --js ../src/easeljs/display/BitmapSequence.js --js ../src/easeljs/display/Shape.js --js ../src/easeljs/display/Text.js --js ../src/easeljs/utils/SpriteSheetUtils.js --js_output_file $OUTPUT

cat license.txt >> $FINAL
cat $OUTPUT >> $FINAL

rm $OUTPUT