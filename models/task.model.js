const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
	{
		setId: {
      type: Schema.Types.ObjectId, 
      ref: 'Sets'
    },
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    isDone: {
      type: Boolean,
      default: false
    },
    dates: [{ type: Date }]
	},
	{
		timestamps: true
	}
);

const Tasks = mongoose.model('Tasks', TaskSchema);

module.exports = Tasks;
