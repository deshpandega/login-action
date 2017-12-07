const login = function(params){

  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const jwt_secret = params.jwt_secret;
  // const aws = require('aws-sdk');

  // GAKIAIHSLAURYPKVBSSHA
  // Y3CKxhf3WRqd8XEvoXrosFwu7mIr1L9BrKfzrWUTS

  console.log("headers===> "+params.__ow_headers);
  const user = {
    username: params.user.username,
    password: params.user.password,
    fullname: "Gaurang Deshpande",
    profileIcon: null,
    createdDate: new Date(),
    hobbies: [
      {
        name: "Painting"
      },
      {
        name: "Bike Riding"
      },
      {
        name: "Crafting"
      }
    ]
  };


  const authenticateUser = () => {
    const token = user.token || params.__ow_headers.token;
    if(token){
      return new Promise((resolve, reject)=> {
        jwt.verify(token, jwt_secret, function(error, decoded){
          if(error){
            reject({
              headers: { 'Content-Type': 'application/json' },
              statusCode: 401,
              body: new Buffer(JSON.stringify("Incorrect Credentials!")).toString('base64')
            });
          }
          else{
            for(key in decoded){
              console.log(decoded[key]);
            }
            
            resolve({
              headers: { 'Content-Type': 'application/json' },
              statusCode: 200,
              body : decoded
            });
          }
        })
      });
    }
    else if(user.username === "" || user.password ===""){
      return new Promise((resolve, reject) => {
        reject({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 401,
          body: new Buffer(JSON.stringify("Please enter username and password!")).toString('base64')
        });
      });
    }
    else if(user.username === "gaurang" && user.password === "gaurang"){
      return new Promise((resolve, reject) => {
        user.password = bcrypt.hashSync(user.password, 10);
        resolve({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 200,
          body : user
        });
      });
    }
    else{
      console.log('Something is wrong with authentication');
      return new Promise((resolve, reject) => {
        reject({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 401,
          body: new Buffer(JSON.stringify("Incorrect Credentials!")).toString('base64')
        });
      });
    }
  };

  const generateToken = (data) => {
    return new Promise((resolve, reject) => {
      if(data){
        console.log('Generate toke here');
        //generate token here
        for(key in data){
          console.log(data[key]);
        }
        console.log("This was the data received");
        const payload = {
          user: data
        };
        console.log('before signing ');
        const token = jwt.sign(payload, jwt_secret);
        console.log('Generate token using jwt here----> '+token);
        resolve({
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          statusCode: 200,
          body : user
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
      console.log('error during authentication-->  '+error.statusCode);
      return ({
         headers: {
            'Content-Type': 'application/json',
            'token': ''
          },
          statusCode: 401,
          body: new Buffer(JSON.stringify("Incorrect Credentials!")).toString('base64')
      });
    });

  return authenticate;
};

exports.main = login;
