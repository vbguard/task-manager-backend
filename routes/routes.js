const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user.controller');
const taskController = require('../controllers/tasks.controller');

const passportUserCheck = passport.authenticate('jwt', {
	session: false
});

router.post('/auth', userController.getUser);

router.get('/tasks', passportUserCheck, taskController.getTasks);
router.delete('/task/:taskId', passportUserCheck, taskController.deleteTask);
router.patch('/task/:taskId', passportUserCheck, taskController.updateTask)
router.post('/tasks', passportUserCheck, taskController.createTask);
router.get('/dezyrka', passportUserCheck, taskController.getTasksSup);

module.exports = router;
