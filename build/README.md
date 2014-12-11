## EaselJS uses [Grunt](http://gruntjs.com/) to manage the build process.

## To use

Note that this requires a familiarity with using the command line. The example commands shown are for use with the OSX Terminal.

### Install dependencies

sass (3.3 or greater is required):
    
    # ruby is required for sass. Check http://sass-lang.com/install for dependencies.
    # Install (or update) sass
    gem install sass;
    
Node (0.10.x or greater is required):

	# check the version via the command line
	node -v

If your Node install is out of date, get the latest from [NodeJS.org](http://nodejs.org/)

After node is setup, install the other dependencies. You may want to familiarize yourself with the Node Packager Manager (NPM) before proceeding.

	# Install the grunt command line utility globally
	sudo npm install grunt-cli -g

	# Change to the build directory, which contains package.json
	cd /path/to/libraryName/build/

	# Install all the dependencies from package.json
	npm install

### Setup

You can change the default settings to suit your local work environment by overriding them in a "config.local.json" file in the build directory. All paths can either be relative to the build folder, or absolute paths.

* docs_out_path - Location of the uncompressed generated docs.

### Building
To export a release build for this library run:

	grunt build

This command will:

* Update the version.js file(s) with the current date and version number from config
* Create the {PROJECT_NAME}-{VERSION}.min.js file, and move it to ../lib
* Generate the documentation in the docs_out_path from config
* Create a zip file of the documentation and move it to ../docs

**NEXT version**

The same process as above, but uses "NEXT" as the version. This is used to generate minified builds with the latest source between release versions.

	grunt next

**Combined File**

The same as the NEXT process, but will not minify the source code. All code formatting and comments are left intact.

	grunt combine


### All commands

* grunt build -  Build everything based on the version in package.json
* grunt next - Build everything using the NEXT version.
* grunt combine - Build a NEXT version, but leave comments and formatting intact.
* grunt docs - Build only the docs
* grunt exportScriptTags - Export valid <script /> tags from the config.json file.
* grunt nextlib - Export NEXT versions of the lib.
