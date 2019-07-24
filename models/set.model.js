const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetSchema = new Schema(
	{
		tasks: [{
      type: Schema.Types.ObjectId,
      ref: "Tasks"
    }]
	},
	{
		timestamps: true
	}
);

const Sets = mongoose.model('Sets', SetSchema);

module.exports = Sets;
;