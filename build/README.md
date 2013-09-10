## We use grunt (http://gruntjs.com/) to manage our build process.

If you previously used an older process, you may want to clean up the node_modules and output folders.

## To use

### Install dependencies

Node (0.10.x or greater is required):

   # check the version
   node -v

If your node is out of date, install the latest from:
http://nodejs.org/

After node is setup, install the other dependances:

   # Install the grunt command line utility
   sudo npm install grunt-cli -g

   # Install all the dependencies for this project.
   npm install

### Setup

You'll need to change the default settings to suit your work environment.
We have 2 config files:

* config.json - Is meant to be in git and pushed to all developers.
* config.local.json - Is added to .gitignore and and only for your local setup (any settings in here will override those in config.json)

Please adjust these settings to match your environment. All paths can either be relative from the build folder, or absolute paths.

* docs_out_path - Location of the created YUIdocs. (Will be in your CreateJS.com/Docs/ folder)

### Building
To export a release build for this library run:

   grunt build

This command will:

* Update the version.js file(s).
* Create the {PROJECT_NAME}-{VERSION}.min.js file
* Compile the docs to config.docs_out_path
* Create a zip file of the docs/
* Copy the docs zip to ../docs
* Copy the built js file to ../lib
* Copy All examples from ../examples to config.examples_out_path

To build the NEXT version run:

grunt next

Does the exact same process as above but uses NEXT as the version.


### All commands

grunt build -  Build everything based on the version in package.json
grunt next - Build everything using the NEXT version.
grunt docs - Build only the docs
grunt uglify - Create the Easel and MovieClip min files. (Will use NEXT as the version)
