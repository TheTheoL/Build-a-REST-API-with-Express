'use strict';
const { User } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticate } = require('./middleware/authenticate');

const express = require('express');

// Construct a router instance.
const router = express.Router();

//Routes for the users
//This route returns all properties and values for the current authenticated User.
router.get('api/users', authenticate, asyncHandler (async (req, res) => {
    const user = req.currentUser;
    res.json(user);
}));