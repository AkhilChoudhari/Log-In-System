var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId; //id for each item inserted

var User = mongoose.model('User', new Schema({
	id: ObjectId,
	firstname: String,
	lastname: String,
	email: {type: String, unique: true},
	password: String,
	wins: Number,
	lose: Number,
	tie: Number
}));

var app = express();
app.set('view engine', 'jade');

//connect to databse akhil
mongoose.connect('mongodb://localhost/akhil');

//middleware
app.use(bodyParser.urlencoded({extended: true }));

app.get('/',function(req,res){
	res.render('index.jade');
});

app.get('/register',function(req,res){
	res.render('register.jade');
});

app.post('/register',function(req,res){
	//res.setHeader('Content-Type', 'application/json')
	var user = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password
	});
	console.log(req.body);

	user.save(function(err){
		if(err){
			var err= "Something went wrong";
			if(err.code === 11000){
				error = 'That e mail is already taken';
			}

			res.render('register.jade', {error: error});

		} else {
			res.redirect('/dashboard');
		}
	});
});

app.get('/login',function(req,res){
	res.render('login.jade');
});

app.post('/login', function(req, res){
	User.findOne({email: req.body.email}, function(err, user){
		if(!user){
			res.render('login.jade', {error: "Invalid email or password"});
		} else {
			if(req.body.password === user.password){
				res.redirect('/dashboard');
			} else {
				res.render('login.jade', {error: "Invalid email or password"});
			}
		}
	});
});

app.get('/dashboard',function(req,res){
	res.render('dashboard.jade');
});

app.get('/logout',function(req,res){
	res.redirect('/');
});

app.listen(3000);
