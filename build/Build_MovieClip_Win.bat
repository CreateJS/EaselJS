@ECHO off
CD %~dp0

SET LCNAME=movieclip

ECHO --- %LCNAME% ---
SET /P VERSION=Please enter version number [x.x.x] [default: 'NEXT'] : 
IF "%VERSION%"=="" SET VERSION=NEXT
ECHO.  

:ASK
ECHO Would you like move [y/n] ?
SET /P COPY='%LCNAME%-%VERSION%.min.js' to lib folder [default: 'y'] 
IF "%COPY%"=="" SET COPY=Y
IF "%COPY%"=="y" SET COPY=Y
IF "%COPY%"=="n" SET COPY=N
IF "%COPY%"=="Y" GOTO :Build
IF "%COPY%"=="N" GOTO :Build
GOTO :ASK

:Build
ECHO.
ECHO Building %LCNAME% version: %VERSION%
node ./buildMovieClip.js --tasks=ALL --version=%VERSION% -v
ECHO.

IF "%COPY%"=="N" GOTO :Wait
CD output/
ECHO '%LCNAME%-%VERSION%.min.js' was copied to 'lib' folder
MOVE /Y "%LCNAME%-%VERSION%.min.js" "../../lib" > %temp%/deleteme.txt
ECHO.
CD ../

:Wait
ECHO.
ECHO --- Complete ---
PAUSE