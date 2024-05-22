var userModel = require('../models/User');
var key = '123456789tryrtryrtryr';
const NodeRSA = require('node-rsa');
//var encryptor = require('simple-encryptor')(key);

//create a new user method takes in the user details input and makes a new user
module.exports.createUserDBService =(userDetails) =>{

    return new Promise((resolve, reject) => {
       //create an instance we defined of the user class/model form UserModel.js
        var userModelData = new userModel();

        userModelData.name = userDetails.name;
        userModelData.username = userDetails.username;
        userModelData.password = userDetails.password;

        const key = new NodeRSA({ b: 512 });
        const rsaPublicKey = key.exportKey('public');
        const rsaPrivateKey = key.exportKey('private');
        userModelData.rsaPublicKey = rsaPublicKey;
        userModelData.rsaPrivateKey = rsaPrivateKey;
        //encrypt the password using a key
        //var encrypted = encryptor.encrypt(userDetails.password);
       // userModelData.password = encrypted;
    
        //once we have the user object we save into the database and if the 
        //values are valid it saves otherwise it rejects input
        userModelData.save()
          .then((result) => {
            resolve(true);
          })
          .catch((error) => {
            reject(false);
          });
    })
    
};

module.exports.loginUserDBService = (userDetails) => {
  return new Promise((resolve, reject) => {
    //get an instance of the user input and if we find one
    userModel.findOne({ username: userDetails.username })
      .then(result => {
        if (result) {
          const isMatch =  bcrypt.compare(userDetails.password, result.password);
          //var decrypted = encryptor.decrypt(result.password);
          //check if the decrypted password stored in the db is the same as the password input
          if (isMatch) {
            //the validate login otherwise reject login
            resolve({
              status: true,
              msg: "Login validated successfully",
            });

            //create a jwt token for the user logging in
            const token = jwt.sign({ id: result._id }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token });
          } else {
            reject({
              status: false,
              msg: "Login failed",
            });
          }
          //if the user input the wrong credentials, they have input invalid username
        } else {
          reject({
            status: false,
            msg: "Invalid user details",
          });
        }
      })
//otherwise if they just put empty/wrong input the outout is invalid data
      .catch(error => {
        reject({
          status: false,
          msg: "Invalid Data",
        });
      });
  });
};