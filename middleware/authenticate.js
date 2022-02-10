'use strict';
const auth = require('basic-auth');
//Import the bcrypt module
const bcrypt = require('bcryptjs');
//Import the User model 
const { User } = require('../models');


// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    let message; 
    const credentials = auth(req);
  
     if (credentials) {
        const User = await User.findOne({ where: {emailAddress: credentials.emailAddress, password: credentials.password} });
       
     } else {
        message = `Authentication failure for email: ${User.emailAdress}`;
      }
            if (credentials) {
                
                const authenticated = bcrypt
                .compareSync(credentials.password, User.confirmedPassword);
                
            } else {
                message = `User not found for student: ${credentials.password}`;
              }
            if (authenticated) { // If the passwords match
                console.log(`Authentication successful for password: ${User.fisrtName}`);

        // Store the user on the Request object.
                req.currentUser = user;
            } else {
                message = 'Auth header not found';
            }
        
    
  
  // Or if user authentication succeeded...
     // Call the next() method.
    next();
  }