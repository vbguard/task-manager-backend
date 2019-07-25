/* eslint-disable func-names */
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtSecretKey = require('../config/config').jwtSecretKey;
const Users = require('../models/user.model');

passport.use(
	new LocalStrategy(
		{
			usernameField: 'user[email]',
			passwordField: 'user[password]'
		},
		(email, password, done) => {
			Users.findOne({email})
				.then(user => {
					if (!user || !user.validatePassword(password)) {
						return done(null, false, {
							errors: {'email or password': 'is invalid'}
						});
					}

					return done(null, user);
				})
				.catch(done);
		}
	)
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtSecretKey
		},
		function(jwtPayload, cb) {
			//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
			Users.findById(jwtPayload.userId)
				.then(user => {
					return cb(null, user);
				})
				.catch(err => {
					return cb(err);
				});
		}
	)
);
// const JwtStrategy  = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const LocalStrategy = require('passport-local').Strategy;
// // const GitHubStrategy = require('passport-github').Strategy;
// // const FacebookStrategy = require('passport-facebook').Strategy;
// // const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const jwtSecretKey = require('../config/config').jwtSecretKey;
// const User = require('../models/user.model');

// module.exports = function(passport) {
//   console.log(passport);
// 	const opts = {};
// 	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// 	opts.secretOrKey = jwtSecretKey;

// 	passport.use(
// 		new JwtStrategy(opts, (jwtPayload, done) => {
//       console.log(jwtPayload);

// 			User.findOne({_id: jwtPayload.userId}, (err, user) => {
// 				if (err) return done(err, false);

// 				if (user) return done(null, user);

// 				return done(null, false);
// 				// or you could create a new account
// 			});
// 		})
// 	);

// 	passport.use(
// 		new LocalStrategy(
// 			{
// 				usernameField: 'username',
// 				passwordField: 'password'
// 			},
// 			(username, password, done) => {
// 				User.findOne({nickname: username}, (err, user) => {
// 					if (err) throw err;

// 					if (!user) return done(null, false, {message: 'Unknown User'});

// 					user.comparePassword(password, (err, isMatch) => {
// 						if (err) throw err;
// 						if (isMatch) return done(null, user);
// 						return done(null, false, {message: 'Invalid password'});
// 					});
// 				});
// 			}
// 		)
// 	);

// 	passport.serializeUser((user, done) => {
// 		done(null, user.id);
// 	});

// 	passport.deserializeUser((id, done) => {
// 		User.findById(id, (err, user) => {
// 			done(err, user);
// 		});
// 	});

// 	// passport.use(
// 	// 	new GitHubStrategy(
// 	// 		{
// 	// 			clientID: process.env.GITHUB_CLIENT_ID,
// 	// 			clientSecret: process.env.GITHUB_CLIENT_SECRET,
// 	// 			callbackURL: `${process.env.URL}${process.env.API_PATH}${API_VERSION}/auth/github/callback`
// 	// 		},
// 	// 		async (accessToken, refreshToken, profile, done) => {
// 	// 			try {
// 	// 				const user = await User.findOne({githubId: profile.id});

// 	// 				if (user) return done(err, user);
// 	// 				if (!user) {
// 	// 					const newUser = new User({
// 	// 						githubId: profile._json.id,
// 	// 						name: profile._json.name,
// 	// 						avatar: profile._json.avatar_url
// 	// 					});

// 	// 					newUser.save((err, user) => done(err, user));
// 	// 				}
// 	// 			} catch (error) {
// 	// 				done(error, null);
// 	// 			}
// 	// 		}
// 	// 	)
// 	// );

// 	// passport.use(
// 	// 	new FacebookStrategy(
// 	// 		{
// 	// 			clientID: '',
// 	// 			clientSecret: '',
// 	// 			callbackURL: `https://domain/api/auth/facebook/callback`
// 	// 		},
// 	// 		async (accessToken, refreshToken, profile, done) => {
// 	// 			try {
// 	// 				const user = await User.findOne({facebookId: profile.id});
// 	// 				if (user) return done(err, user);
// 	// 				if (!user) {
// 	// 					const newUser = await new User({
// 	// 						githubId: profile._json.id,
// 	// 						name: profile._json.name
// 	// 					});

// 	// 					newUser.save((err, user) => done(err, user));
// 	// 				}
// 	// 			} catch (error) {
// 	// 				done(error, null);
// 	// 			}
// 	// 		}
// 	// 	)
// 	// );

// 	// passport.use(
// 	// 	new GoogleStrategy(
// 	// 		{
// 	// 			clientID: '',
// 	// 			clientSecret: '',
// 	// 			callbackURL: `https://domain/api/auth/google/callback`
// 	// 		},
// 	// 		async (accessToken, refreshToken, profile, done) => {
// 	// 			console.log(profile);
// 	// 			try {
// 	// 				const user = await User.findOne({googleId: profile.id});

// 	// 				if (user) return done(err, user);
// 	// 				if (!user) {
// 	// 					const newUser = await new User({
// 	// 						googleId: profile._json.sub,
// 	// 						name: profile._json.name,
// 	// 						avatar: profile._json.picture
// 	// 					});

// 	// 					newUser.save((err, user) => done(err, user));
// 	// 				}
// 	// 			} catch (error) {
// 	// 				done(error, null);
// 	// 			}
// 	// 		}
// 	// 	)
// 	// );
// };
