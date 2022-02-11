'use strict';
const { User } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/authenticate');

const express = require('express');
const Course = require('./models/Course');

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

//COURSE ROUTES

//return all courses including the user associated with the course.
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: {
            model: User,
            as: 'student',
            attributes: ['firstName', 'lastName', 'emailAddress']
        }
    });
    res.status(200).json(courses);
}));

module.exports = router;