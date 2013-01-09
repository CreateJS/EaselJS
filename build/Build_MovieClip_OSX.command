#!/bin/bash
cd $(dirname "$0")

LCNAME="movieclip"

echo -e "\r--- $LCNAME ---"
echo -n "Enter version number [x.x.x] [default: "NEXT"] "
read VERSION
echo -e "\r"

if [ "$VERSION" == "" ] 
then
	VERSION="NEXT";
fi    

while [ "$COPY" != "Y" ] || [ "$COPY" != "y" ] || [ "$COPY" != "n" ] || [ "$COPY" != "N" ] || [ "$COPY" == "" ]
do
echo -e "Would you like move [y/n] ?\n'${LCNAME}-${VERSION}.min.js' to lib folder [default: 'y']"
read COPY

if [ "$COPY" == "" ] || [ "$COPY" == "Y" ] || [ "$COPY" == "y" ]
then
	COPY="y";
    break;
fi 
if [ "$COPY" == "n" ] || [ "$COPY" == "N" ]
then
    break;
fi 
done

echo -n "Building $LCNAME version: $VERSION"
node ./buildMovieClip.js --tasks=ALL --version=$VERSION -v # run the build
echo -e "\r"

if [ "$COPY" == "y" ] # spaces are important!
then
	echo -n "'${LCNAME}-${VERSION}.min.js' was copied to 'lib' folder"
	mv -f "./output/${LCNAME}-${VERSION}.min.js" ../lib
    echo -e "\r"
    echo -e "\r"
fi

echo "--- Complete ---"
