// **   TODO:        */
//! @ GET --- userId => find sets by userId => sets of User populate tasks === Finish😀
//!
//!
const Tasks = require('../models/task.model');
const Sets = require('../models/set.model');

const updateTask = (req, res) => {
	const taskId = req.body._id;
	const newFields = {
		title: req.body.title,
		description: req.body.description,
		dates: req.body.dates
	};

	Tasks.findOneAndUpdate({ _id: taskId }, {$set: newFields}, { new: true })
		.then(result => {
      if (result) {
        getTasks(req, res);
      }
    })
		.catch(err =>
			res.status(400).json({success: false, error: err, message: err.message})
		);
};

const getTasks = (req, res) => {
	const userId = req.user._id;
	Sets.find({userId: userId})
		.populate('tasks')
		.then(result => {
			if (!result) {
				res.status(200).json({
					success: true,
					tasks: result,
					message: 'User not have any tasks'
				});
			}
			const getOnlyTasks = result
				.map(set => set.tasks)
				.reduce((acc, val) => acc.concat(val), []);
			res.status(200).json({success: true, tasks: getOnlyTasks});
		})
		.catch(err =>
			res.status(400).json({success: false, error: err, message: err.message})
		);
};

const createTask = async (req, res) => {
	const title = req.body.title;
	const description = req.body.description;
	const dates = req.body.dates;

	if (!title && description && dates) {
		res
			.status(422)
			.json({
				success: false,
				message: 'Some of fields empty or not (title, description, dates)'
			})
			.end();
	}

	const userId = req.user._id;

	const newSet = await new Sets({userId: userId});

	const newTasks = [];

	for (let i = 0; i < dates.length; i++) {
		newTasks.push({
			title: title,
			description: description,
			dates: dates,
			setId: newSet._id
		});
	}

	Tasks.insertMany(await newTasks)
		.then(result => {
			if (result) {
				//! get new tasks ID and add to new this SET
				const getNewTasksId = result.map(task => task._id);

				newSet.tasks = getNewTasksId;
				newSet
					.save()
					.then(setResult => {
						if (setResult) {
							getTasks(req, res);
						}
					})
					.catch(err =>
						res
							.status(400)
							.json({success: false, error: err, message: err.message})
					);
			}
		})
		.catch(err =>
			res.status(400).json({success: false, error: err, message: err.message})
		);
};

module.exports = {
	getTasks,
	updateTask,
	createTask
};
