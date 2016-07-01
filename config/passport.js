var LocalStrategy = require('passport-local').Strategy;

var Usuario = require('../app/models/user');

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		Usuario.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'senha',
		passReqToCallback: true
	},function(req, email, senha, done){
			process.nextTick(function(){
				Usuario.findOne({'local.email': email}, function(err, user){
					if(err)	return done(err);

					if(user){
						return done(null, false, req.flash('signupMessage', 'That email already taken'));
					}else{
						var newUser = new Usuario();
						newUser.local.email = email;
						newUser.local.senha = newUser.generateHash(senha);

						newUser.save(function(err){
							if(err) throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}
	));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'senha',
		passReqToCallback: true
	},
		function(req, email, senha, done){
			process.nextTick(function(){
				Usuario.findOne({ 'local.email': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(!user.validPassword(senha)){
						return done(null, false, req.flash('loginMessage', 'inavalid password'));
					}
					return done(null, user);

				});
			});
		}
	));
};