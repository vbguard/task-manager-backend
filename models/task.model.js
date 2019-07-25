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

TaskSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  if (update.__v != null) {
    delete update.__v;
  }
  const keys = ['$set', '$setOnInsert'];
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

const Tasks = mongoose.model('Tasks', TaskSchema);

module.exports = Tasks;
