const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user.controller');
const taskController = require('../controllers/tasks.controller');

const passportUserCheck = passport.authenticate('jwt', {
	session: false
});

router.post('/auth', userController.getUser);

router.get('/tasks', passport.authenticate('jwt', { session: false }), taskController.getTasks);

router.post('/task', passportUserCheck, taskController.updateTask)
router.post('/task/create', passportUserCheck, taskController.createTask);

module.exports = router;
