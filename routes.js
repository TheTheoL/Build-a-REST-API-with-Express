'use strict';
const { User, Course } = require('./models');
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

//Create a new user
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location('/').end();
    } catch (error) {
      console.log('ERROR: ', error.name);
  
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
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

//Route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
        include: {
            model: User,
            as: 'student',
            attributes: ['firstName', 'lastName', 'emailAddress']
        }
    });
        if (!course) {
            const error = new Error();
            error.status = 404;
            error.message = 'Course not found';
            next(error);
            } else {
                res.status(200).json(course);
        }
    })
  );

//Route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses', authenticateUser, asyncHandler (async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).location(`/courses/${course.id}`).end();
    }
    catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
          } else {
            throw error;
          }
    } 
}));

//Route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser,
asyncHandler(async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        await course.update(req.body);
        res.status(204).end();
    }
    catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
          } else {
            throw error;
          }
    } 
  }));

//route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', authenticateUser,
asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
    if (!course) {
        const error = new Error();
        error.status = 404;
        error.message = 'Course not found';
        next(error);
    } else if (req.currentUser.id !== course.userId) {
        const error = new Error();
        error.status = 403;
        error.message = "Only the student can delete this course.";
        next(error);
    }   else {
        await course.destroy();
        res.status(204).end();
  }
})
);



module.exports = router;

