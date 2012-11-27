#! /bin/sh

echo compress style.css to style.min.js
java -jar ../yuicompressor-2.4.7.jar --type css --charset utf8 -v -o style.min.css style.css

echo done
