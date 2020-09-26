
/**
	* Node.js Login Boilerplate
	* More Info : https://github.com/braitsch/node-login
	* Copyright (c) 2013-2020 Stephen Braitsch
**/

var http = require('http');
var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');
var app = express();
var CT = require('./app/server/modules/country-list');
app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));


const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quiz_admin'
});

mc.connect();
var sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
        tableName: 'user_session',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, mc);
app.use(session({
    key: '69Atu22GZTSyDGW4sf4mMJdJ42436gAs',
    secret: '3dCE84rey8R8pHKrVRedgyEjhrqGT5Hz',
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));
//require('./app/server/routes')(app);
app.get('/', function(req, res){
	res.render('login', { title: 'Hello - Please Login To Your Account' });
});
app.post('/', function(req, res){
	let user = req.body['user'];
	let password = req.body['pass'];
	mc.query('SELECT * FROM user where username= ? and password =  ? ',[user,password], function (e, o) {
		if (e) res.status(400).send(e);
		var string=JSON.stringify(o);
        var json =  JSON.parse(string);
		req.session.user = json;
		return res.status(200).send(json);
    });
});

app.get('/responde-pregunta', function(req, res) {
	console.log("session_user",req.session.user);
	if (req.session.user == null){
		res.redirect('/');
	}	else{
		res.render('home', {
			title : 'Control Panel',
			countries : CT,
			udata : req.session.user
		});
	}
});
app.post('/responde-pregunta', function(req, res) {
	if (req.session.user == null){
		res.redirect('/');
	}	else{
		let user_id = req.session.user.id_user;
		let question1 = req.body['primera_pregunta'];
		let question2 = req.body['segunda_pregunta'];
		let question3 = req.body['tercera_pregunta'];
		console.log(json);
		 if (!user_id) {
			return res.status(400).send({ error:true, message: 'Please provide quiz' });
		}
	 
		mc.query("INSERT INTO question SET ? ", { id_user: id_user, question1: question1,question2:question2,question3:question3}, function (error, results, fields) {
			if (error) throw error;
			return res.send({ error: false, data: results, message: 'New quiz has been created successfully.' });
		});
	}
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

