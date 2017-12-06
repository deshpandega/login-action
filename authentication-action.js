const login = function(params){

  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const jwt_secret = params.jwt_secret;
  // const aws = require('aws-sdk');

  // AKIAIHSLAURYPKVBSSHA
  // Y3CKxhf3WRqd8XEvoXrosFwu7mIr1L9BrKfzrWUT

  const user = {
    username: params.user.username,
    password: params.user.password,
    fullname: params.user.fullname,
    token: params.user.token,
    createdDate: params.user.createdDate
  };


  const authenticateUser = () => {
    if(user.token!="" && user.token!=null && user.token != undefined){
      
      return new Promise((resolve, reject)=> {
        resolve({

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
        const payload = {
          user: user
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
      return error;
    });

  return authenticate;
  // ({
  //   headers: { 'Content-Type': 'application/json' },
  //   statusCode: 200,
  //   body: new Buffer(JSON.stringify("Hello World Here!")).toString('base64')
  // });
};

exports.main = login;
