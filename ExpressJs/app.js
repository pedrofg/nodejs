const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs')
const db = mongojs('customerapp', ['users'])
const ObjectId = mongojs.ObjectId;

const app = express();


//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Set Static Path
app.use(express.static(path.join(__dirname, 'public')));


// Global vars
app.use( (req, res, next) => {
	res.locals.errors = null;
	next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


const get = app.get('/', (req, res) => {

	db.users.find(function (err, docs) {

    	res.render('index', {
			title: 'Customers',
			users: docs
		});
	});	
});


app.post('/users/add', (req, res) => {

	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('last_name', 'Last Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	let errors = req.validationErrors();

	if (errors) {

		res.render('index', {
		title: 'Customers',
		users: users,
		errors: errors
		});

		console.log('Erros');

	} else {

		let newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email
		}

		db.users.insert(newUser, (err, result) => {
			if(err){
				console.log(err);
			}else{
				res.redirect('/');
			}
		});

	}
});

app.delete('/users/delete/:id', (req, res) => {
	console.log('delete');
	db.users.remove({_id: ObjectId(req.params.id)}, (err, result) => {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});
});


app.get('/users/update/:id/:first_name/:last_name/:email', (req, res) => {

	console.log('update');

	let id = req.params.id;
	let firstName = req.params.first_name;
	let lastName = req.params.last_name;
	let email = req.params.email;

	console.log('id: ' + id);
	console.log('firstName: ' + firstName);
	console.log('lastName: ' + lastName);
	console.log('email: ' + email);

	db.users.update({_id: ObjectId(id)}, {$set: {first_name: firstName, last_name: lastName, email: email}}, (err, result) => {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});

});

app.listen(3000, () => {

	console.log('server started on port 3000')

}); 