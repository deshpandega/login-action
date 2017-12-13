exports.login = function login(params){

  //import statements to use multiple modules
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const mongoClient = require('mongodb').MongoClient;

  // Environment variable we are loading as params from config.json file
  const jwt_secret = params.jwt_secret;
  const collectionName = params.collectionName;
  const databaseConnections =  params.mongoDB_connection;

  console.log("collection name -> "+collectionName);
  console.log("JWT secret===> "+jwt_secret);
  
  //Generate the user information from parameters sent in request
  // const user = {
  //   email: params.user.username,
  //   password: params.user.password,
  //   name: "Gaurang Deshpande",
  //   profileIcon: null,
  //   createdDate: new Date(),
  //   hobbies: [{name: "Painting"}]
  // };
  const user = {
    "name":"",
    "password" : "",
    "email" : "",
    "profileIcon": "",
    "dob" : "",
    "aboutme" : "",
    "hobbies" : [{
        "name" : ""
      }],
    "registeredevents" : [{
        "name" : "",  
        "venue" : ""
      }],
    "hostedevents" : [{
        "name" : "", 
        "venue" : ""
      }]
  };

  // Overright the properties sent from user to user object above
  const queryParam = Object.assign(user, params.user);
  
  // References to use throughtout
  let database;
  let dbClient;

  const checkUser = () => {
    // const token = user.token || params.__ow_headers.token;
    return new Promise((resolve, reject)=>{
      if(queryParam.username === "" || queryParam.password ===""){
        reject(`401: Please enter username and password!`);
      }
      else{
        resolve(queryParam);
      }
    });
  };

  const authenticateUser = (queryParam) => {
    // Encrypt user password
    // queryParam.password=bcrypt.hashSync(queryParam.password, 10);
    console.log("this is normal password-> "+queryParam.password);
    return new Promise((resolve, reject)=>{
      mongoClient.connect(databaseConnections, (err, client)=>{
        if(err){
          console.log("error in DB connection -> "+err);
          reject(`401:${err}`);
        }
        else{
          dbClient = client;
          database = client.db('hobbylocale');

          // Get collection name from database
          const collection = database.collection(collectionName);

          // Find if the user is already present in database
          collection.findOne({email:queryParam.email}, (err, userData)=>{
            if(userData){
              console.log("this is hashed password-> "+userData.password);
              bcrypt.compare(queryParam.password, userData.password, (err, res)=>{
                if(res){
                  console.log("Access Granted!");
                  resolve(userData);
                }
                else{
                  reject('401:Access Denied!');
                }
              })
            }
            else{
              reject('401:Access Denied!');
            }
          });
        }
      });
    });
  }

  const generateToken = (data) => {
    return new Promise((resolve, reject) => {
      if(data){
        //generate token here
        const payload = {
          user: data
        };

        console.log('Generating token here');
        const generatedToken = jwt.sign(payload, jwt_secret);
        
        const response = {
          email: payload.user.email,
          password: payload.user.password,
          name: payload.user.name,
          profileIcon: payload.user.profileIcon,
          dob: payload.user.dob,
          aboutme: payload.user.aboutme,
          hobbies: payload.user.hobbies,
          registeredevents: payload.user.registeredevents,
          hostedevents: payload.user.hostedevents,
          token: generatedToken
        }

        console.log(response.user+" <--> "+response.token);

        resolve({
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          body :new Buffer(JSON.stringify(response)).toString('base64') 
        });

      }
      else{
        reject("401:Incorrect Credentials!");
      }
    });
  };

  const authenticate = checkUser()
    .then(authenticateUser)
    .then(generateToken)
    .then((data)=>{
        return data;
      })
    .catch((error)=>{
      console.log("error is --->> "+error);
      const status = error.split(':')[0];
      const errorMessage = error.split(':')[1];
      return ({
         headers: {
            'Content-Type': 'application/json'
          },
          statusCode: status,
          body: new Buffer(JSON.stringify(errorMessage)).toString('base64')
      });
    });

  return authenticate;
};



exports.logout = (params) => {
  // Imports 
  const jwt = require('jsonwebtoken');

  // Environment variable we are loading as params from config.json file
  const jwt_secret = params.jwt_secret;

  // Sign an empty token
  const signedToken = jwt.sign({}, jwt_secret);

  return({
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode: 200,
    body: {token:signedToken}
  })
}

exports.checkToken = (params) => {
  const jwt = require('jsonwebtoken');

  // Environment variable we are loading as params from config.json file
  const jwt_secret = params.jwt_secret;   

  // Get token sent from user
  const userToken = params.generatedToken;

  // Check user data sent using token
  const userData = jwt.decode(userToken, {complete:true});

  if(userData) {
    return({
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      body: new Buffer(JSON.stringify(userData.payload)).toString('base64')
    });
  }
  else{
    return({
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 404,
      body: new Buffer(JSON.stringify("No token passed")).toString('base64')
    });
  }

};