// **   TODO:        */
//! @ GET --- userId => find sets by userId => sets of User populate tasks === Finish😀
//!
//!
const Tasks = require('../models/task.model');
const Users = require('../models/user.model');

const updateTask = (req, res) => {
	const taskId = req.body._id;
	const newFields = {
		title: req.body.title,
		description: req.body.description,
		dates: req.body.dates,
		isDone: req.body.isDone
	};

	Tasks.findOneAndUpdate({_id: taskId}, {$set: newFields}, {new: true})
		.then(result => {
			if (result) {
				getTasks(req, res);
			}
		})
		.catch(err =>
			res.status(400).json({success: false, error: err, message: err.message})
		);
};

const deleteTask = (req, res) => {
	//TODO:
	//! delete SET and delete taskId if have - many task delete ALL
	//?  get dates task from request
	//! delete task from set and check by dates
	const taskId = req.params.taskId;
	const userId = req.user.id;
	console.log(taskId);

	Tasks.findOneAndRemove({_id: taskId}, (err, doc) => {
		if (err) {
			res.status(400).json({
				status: 'BAD',
				message: `Not task found`
			});
		}
		if (doc) {
			Users.findByIdAndUpdate(userId, {$pull: {userTasks: taskId}})
				.then(user => {
					if (user) {
						res.status(200).json({
							status: 'OK',
							message: `Task ${doc._id} deleted successful`,
							taskId: doc._id
						});
					}
				})
				.catch(err => {
					throw new Error(err);
				});
		}
	});
};

const getTasks = async (req, res) => {
	const userId = req.user._id;
	// Tasks.aggregate([
	// 	{$match: {userId: userId}},
	// 	{$unwind: '$dates'},
	// 	{$sort: {'dates.date': 1}},
	// 	{$group: {_id: '$_id', dates: {$push: '$dates'}}},
	// 	{$project: {dates: '$dates'}}
	// ])

  //========================================================
  try {
    
  const calendar = await Tasks.aggregate([
		{$match: {userId: userId}},
		//   {
		//   $arrayToObject: {
		//     datesParse: { $sum: "$homework" } ,
		//     totalQuiz: { $sum: "$quiz" }
		//   }
		// },
		{$unwind: '$dates'},
		// {
		// 	$project: {
		// 		_id: 0,
		// 		// isRepeat: 1,
		// 		dates: {
		// 			$map: {
		// 				input: '$dates',
		// 				as: 'd',
		// 				in: {
		// 					date: '$$d.date',
		// 					isRepeat: '$isRepeat',
		// 					taskId: '$_id'
		// 					// $mergeObjects: ['$$value', '$$this']}
		// 				}
		// 			}
		// 		}
		// 	}
		// },
		//=======================================================
		{
			$addFields: {
				'dates.taskId': '$_id'
			}
		},
		// Second Stage
		{
			$group: {
				_id: {
					$dateToString: {format: '%Y-%m-%d', date: '$dates.date'}
				},
				countRepeat: {$sum: {$cond: ['$isRepeat', 1, 0]}},
				countOne: {$sum: {$cond: ['$isRepeat', 0, 1]}},
				repeatTasks: { $addToSet: { taskId: {$cond: ['$isRepeat', '$_id', null]}}},
				oneTasks: {$addToSet: {taskId: {$cond: ['$isRepeat', null, '$_id']}}}
				// tasksRepeatIds: {
				// 	$push: {
				// 		$cond: ['$isRepeat', '$_id', null]
				// 	}
				// }
			}
			// averageQuantity: {$avg: '$quantity'},
			// taskId: '$_id'
		},
		{
			$project: {
				repeatTasks: {
					tasksIds: {
						$map: {
							input: '$repeatTasks',
							as: 'task',
							in: '$$task.taskId'
						}
					},
					count: '$countRepeat'
        },
        oneTasks: {
					tasksIds: {
						$map: {
							input: '$oneTasks',
							as: 'task',
							in: '$$task.taskId'
						}
					},
					count: '$countOne'
				}
			}
    },
    {
			$project: {
				repeatTasks: { "$arrayElemAt": [ "$repeatTasks", 0 ] } ,
        oneTasks: { "$arrayElemAt": [ "$oneTasks", 0 ] }
			}
    },
		// {
		// 	$addFields: {
		// 		counterRepeat: {
		// 			count: '$countRepeat',
		// 			tasksIds: {$push: {$tasksIds: '$_id'}}
		// 		},
		// 		counterOne: {count: '$countOne'}
		// 	}
		// },
		// {$sort: {_id: 1}}
		// {$group: {_id: '$_id', dates: {$push: '$dates'}}}
		// {
		// 	$group: {
		// 		_id: {date: '$dates'}
		// 	}
		// }
	]);
	const userTasks = await Tasks.find({userId: userId}, {__v: 0, userId: 0, createdAt: 0, updatedAt: 0})
    .sort({ '$dates.date': 'desc' });

    return res.status(200).json({
      success: true,
      tasks: userTasks,
      calendar,
      message: 'get user tasks and dat for calendar'
    });
  } catch (error) {
    res.status(400).json({success: false, error: err, message: err.message})
  }
    
};

const createTask = async (req, res) => {
	const userId = req.user.id;
	const title = req.body.title;
	const description = req.body.description;
	const dates = req.body.dates;

	Tasks.create({title, description, dates, userId})
		.then(task => {
			if (task) {
				Users.findByIdAndUpdate(userId, {$push: {userTasks: task._id}})
					.then(user => {
						if (user) {
							res.status(201).json({success: true, task: task});
						}
					})
					.catch(err => {
						throw new Error(err);
					});
			}
		})
		.catch(err =>
			res.status(400).json({success: false, error: err, message: err.message})
		);
};

module.exports = {
	getTasks,
	updateTask,
	createTask,
	deleteTask
};
