@ECHO off
CD %~dp0

SET LCNAME=easeljs

ECHO --- %LCNAME% ---
SET /P VERSION=Please enter version number [x.x.x] defaults to 'NEXT' : 
IF "%VERSION%"=="" SET VERSION=NEXT
ECHO.

:ASK
ECHO Would you like to move [y/n] ?
ECHO '%LCNAME%-%VERSION%.min.js' to lib folder &
SET /P COPY='%LCNAME%_docs-%VERSION%.zip' to docs folder [default: 'y'] 
IF "%COPY%"=="" SET COPY=Y
IF "%COPY%"=="y" SET COPY=Y
IF "%COPY%"=="n" SET COPY=N
IF "%COPY%"=="Y" GOTO :Build
IF "%COPY%"=="N" GOTO :Build
GOTO :ASK

:Build
ECHO.
ECHO Building %LCNAME% version: %VERSION%
node ./build.js --tasks=ALL --version=%VERSION% -v
ECHO.

IF "%COPY%"=="N" GOTO :Wait
CD output/
ECHO '%LCNAME%-%VERSION%.min.js' was copied to 'lib' folder
MOVE /Y "%LCNAME%-%VERSION%.min.js" "../../lib" > %temp%/deleteme.txt
ECHO.
ECHO '%LCNAME%-%VERSION%.zip' was copied to 'docs' folder
MOVE /Y "%LCNAME%_docs-%VERSION%.zip" "../../docs" > %temp%/deleteme.txt
ECHO.
CD ../

:Wait
ECHO.
ECHO --- Complete ---
PAUSE