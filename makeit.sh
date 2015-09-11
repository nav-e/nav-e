#!/bin/sh

# download dependencies
bower install

# create a web archive
jar cvf greennav_webapp.war .

