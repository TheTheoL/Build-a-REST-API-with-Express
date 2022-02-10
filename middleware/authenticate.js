'use strict';
const auth = require('basic-auth');
//Import the bcrypt module
const bcrypt = require('bcrypt');
//Import the User model 
const { User } = require('../models');


// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    let message; 
    const credentials = auth(req);
  
     if (credentials) {
        const user = await User.findOne({ where: {firstName: credentials.firstName, lastName: credentials.lastName} });
       
     } else {
        message = `Authentication failure for username: ${user.username}`;
      }
            if (user) {
                
                const authenticated = bcrypt
                .compareSync(credentials.passv, user.confirmedPassword);
                
            } else {
                message = `User not found for student: ${credentials.name}`;
              }
            if (authenticated) { // If the passwords match
                console.log(`Authentication successful for username: ${user.username}`);

        // Store the user on the Request object.
                req.currentUser = user;
            } else {
                message = 'Auth header not found';
            }
        
    
  
  // Or if user authentication succeeded...
     // Call the next() method.
    next();
  }