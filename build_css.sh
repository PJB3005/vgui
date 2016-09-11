#!/bin/bash

for file in styles/*.styl
do
	name=$(echo $file | cut -f 1 -d '.' | cut -f 2 -d '/')
	echo $name

	node_modules/stylus/bin/stylus -c $file -o "styles/processed/$name.css"
done
