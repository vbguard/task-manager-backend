const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user.controller');
const taskController = require('../controllers/task.controller');

const passportUserCheck = passport.authenticate('jwt', {
	session: false
});

router.post('/auth', userController.getUser);

// router.get('/task', passportUserCheck, taskController.getTasks)
// router.post('/task', passportUserCheck, taskController.updateTask);

module.exports = router;
