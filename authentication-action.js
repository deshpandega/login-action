exports.login = function login(params){

  //import statements to use multiple modules
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const mongoClient = require('mongodb').MongoClient;

  // Environment variable we are loading as params from config.json file
  const jwt_secret = params.jwt_secret;

  console.log("JWT secret===> "+params.jwt_secret);
  // const Schema = mongoose.Schema;
  
  //Generate the user information from parameters sent in request
  const user = {
    username: params.user.username,
    password: params.user.password,
    fullname: "Gaurang Deshpande",
    profileIcon: null,
    createdDate: new Date(),
    hobbies: [{name: "Painting"}]
  };

  const authenticateUser = () => {
    // const token = user.token || params.__ow_headers.token;
    return new Promise((resolve, reject)=>{
      if(user.username === "" || user.password ===""){
        reject(`401: Please enter username and password!`);
      }
      else if(user.username === "gaurang" && user.password === "gaurang"){
        user.password=bcrypt.hashSync(user.password, 10);
        resolve(user);
      }
      else{
        reject(`401: User not authorized!`);
      }
    });
  };

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
          username: payload.user.username,
          password: payload.user.password,
          fullname: "Gaurang Deshpande",  //payload.user.name
          profileIcon: null,              //payload.user.profileIcon
          createdDate: new Date(),        //payload.user.createdDate
          hobbies: [{name: "Painting"}],  //payload.user.hobbies
          token: generatedToken
        }

        console.log(response.user+" <--> "+response.token);

        resolve({
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          body : response
        });

      }
      else{
        reject({
          headers: {
            'Content-Type': 'application/json',
            'token': ''
          },
          statusCode: 401,
          body: new Buffer(JSON.stringify("Incorrect Credentials!")).toString('base64')
        });
      }
    });
  };

  const authenticate = authenticateUser()
    .then(generateToken)
    .then((data)=>{
        return data;
      })
    .catch((error)=>{
      console.log("error is --->> "+error);
      const status = error.split(":")[0];
      const errorMessage = error.split(":")[1];

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