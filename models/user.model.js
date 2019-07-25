const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
	{
		nickname: {
      type: String,
			required: true,
			trim: true,
			unique: true,
      index: true,
      minlength: 5,
      maxlength: 15
		},
		password: {
      type: String,
      required: true,
      trim: true
    },
    userTasks: [{
      type: Schema.Types.ObjectId,
      ref: 'Tasks'
    }]
	},
	{timestamps: true}
);

UserSchema.pre(
	'save',
	function(next) {
		var user = this;
		if (!user.isModified('password')) {
			return next();
		}
		bcrypt.hash(user.password, 10).then(hashedPassword => {
			user.password = hashedPassword;
			next();
		});
	},
	function(err) {
		next(err);
	}
);

UserSchema.methods.comparePassword = function(candidatePassword, next) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return next(err);
		next(null, isMatch);
	});
};

const User = mongoose.model('Users', UserSchema);

module.exports = User;