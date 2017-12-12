#!/bin/bash

# Zip the contents of this folder
# These are files that we want to include authentication-action.js package.json package-lock.json node_modules
# exclude all '.sh' files and all '.zip' files while zipping
zip -r login.zip * -x "*.zip" -x "*.sh"


# Create package
wsk -i package update hobbylocale

# Create / Update action
wsk -i action update guest/hobbylocale/login login.zip --kind nodejs:6 --web true --param-file config.json --main=login

wsk -i action update guest/hobbylocale/logout login.zip --kind nodejs:6 --web true --param-file config.json --main=logout

wsk -i action update guest/hobbylocale/session login.zip --kind nodejs:6 --web true --param-file config.json --main=checkToken

# Get urls for created actions
wsk -i action get guest/hobbylocale/login --url
wsk -i action get guest/hobbylocale/logout --url
wsk -i action get guest/hobbylocale/session --url