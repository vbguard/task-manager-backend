const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
	{
		userId: {
      type: Schema.Types.ObjectId, 
      ref: 'Users'
    },
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    isRepeat: {
      type: Boolean
    },
    dates: [
      {
        date: Date,
        isComplete: {
          type: Boolean,
          default: false
        }
      }
    ]
	},
	{
		timestamps: true
	}
);

TaskSchema.pre('save', function(next) {
  const doc = this;
  doc.isRepeat = doc.dates.length > 1;
  next()
}, 
function(err) {
  next(err);
})

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

TaskSchema.methods.getAllDatesInArray = function(data, next) {
  const doc = this;
  console.log(doc);
  console.log(data);
  next();
};

const Tasks = mongoose.model('Tasks', TaskSchema);

module.exports = Tasks;
