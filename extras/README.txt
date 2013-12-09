This directory includes additional code and snippets that might be useful.

** sample.htaccess **
A linux/unix .htaccess file, which provides a cross-origin header to files served from this directory. This is useful
for setting up images served on a domain other than where the application is served from. Images must include a
crossOrigin="Anonymous" attribute. Rename this file to ".htaccess", or add its contents to an existing .htacess file.