# Login Action

This is the micro service to authenticate user, generate token for session management for project **Hobbie Locale**
This project is written in `node.js`  and deployed on [OpenWhisk](https://github.com/apache/incubator-openwhisk)

#### Authors / Contributors

Mitali

Ruchi

Amitha

Shamal

Gaurang


## To resolve dependencies, run following commands

Clone this repository on local machine. Open bash terminal and run following commands:

`cd /path/to/login-action` 

`npm install`

This will install all the dependencies for this project.

## To deploy action to OpenWhisk

**Before You Deploy** 

Make sure you are running the vagrant and your wsk cli is configured completely. Head over to [here](https://github.com/apache/incubator-openwhisk/tree/master/tools/vagrant#using-cli-from-outside-the-vm) to see how to configure the cli.

There is a deployment script written to automate this process.
Run following command to give access to this script:

`chmod +x ./login-deploy.sh`

And then run the script:

`./login-deploy.sh`

The script will zip the contents necessary to generate the action, create a package on OpenWhisk if it doesn't exist, create the action on OpenWhisk with default input parameters,  make is available as *Web Action*, set the language of action developed in and gives back the url for this action.

## Testing Action

To test the created action, use Postman tool to generate requests.