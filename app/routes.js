var Usuario = require('./models/user');

module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index.ejs');
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') })
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}))

	app.get('/cadastrar', function(req, res){
		res.render('cadastrar.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/cadastrar', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/cadastrar',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', {user: req.user})
	})

	app.get('/:email/:senha', function(req, res){
		var novoUsuario = new Usuario();
		novoUsuario.local.email = req.params.email;
		novoUsuario.local.senha = req.params.senha;

		novoUsuario.save(function(err){
			if(err)
				throw err;
		});
		res.send('Sucesso!!!');
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}