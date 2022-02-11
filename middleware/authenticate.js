'use strict';

const auth = require('basic-auth'); 
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
  let message;
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({ where: {emailAddress: credentials.name} });
    if (user) {
      const authenticated = bcrypt
        .compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(`Authentication successful for account: ${user.emailAddress}`);
        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for account: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for account: ${credentials.name}`;
    }
  } else {
      message = 'You have to login in to perform this action';
  }
  if (message) {
    console.warn(message);
    const error = new Error();
    error.status = 401;
    error.message = message;
    next(error);
  } else {
    next();
  }
};