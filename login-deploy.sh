#!/bin/bash

# Zip the contents of this folder
# These are files that we want to include authentication-action.js package.json package-lock.json node_modules
# exclude all '.sh' files and all '.zip' files while zipping
zip -r login.zip * -x "*.zip" -x "*.sh"


# Create package
wsk -i package update hobbylocale

# Create / Update action
wsk -i action update guest/hobbylocale/login login.zip --kind nodejs:6 --web true --param jwt_secret \/\/Eb-De\/-nEu

# https://192.168.33.13/api/v1/namespaces/guest/activations
# https://192.168.33.13/api/v1/namespaces/guest/activations/{activationName}
# https://192.168.33.13/api/v1/namespaces/guest/hobbylocale/login
# curl https://192.168.33.13/api/v1/namespaces/guest/hobbylocale/hello
# https://192.168.33.13/api/v1/web/guest/hobbylocale/login
# wsk -i action get guest/hobbylocale/login --url
wsk -i action get guest/hobbylocale/login --url
