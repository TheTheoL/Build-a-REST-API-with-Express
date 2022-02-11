'use strict';
const { User } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/authenticate');

const express = require('express');

// This array is used to keep track of user records
// as they are created.
const users = [];

// Construct a router instance.
const router = express.Router();

//Routes for the users
//This route returns all properties and values for the current authenticated User.
router.get('/users', authenticateUser, asyncHandler (async (req, res) => {
    const user = req.currentUser;
    res.json(user);
}));

module.exports = router;