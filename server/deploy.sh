#!/bin/bash
git checkout .;
git pull;

# Restart server
forever stop app.js;
forever -a -l node.log -o node.log -e node.log start app.js;