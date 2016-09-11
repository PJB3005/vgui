#!/bin/bash

echo "Unless your intentions are to edit the UI stylesheets, you should not have to run this script for anything!"
echo "Ignore any warnings by npm, it's being a web 2.0 meme."

npm install stylus

if [ $? ]
then
	echo "Everything is alright. Stylus installed correctly."
else
	echo "Fuck panic."
fi
