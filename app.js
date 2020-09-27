


var http = require('http');
var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');
var app = express();

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

app.get('/', function(req, res){
	res.render('login', { title: 'Hola ingresa con tu cuenta' });
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
	if (req.session.user == null){
		res.redirect('/');
	}	else{
		res.render('home', {
			title : 'Responde encuesta',
			udata : req.session.user
		});
	}
});
//todo
app.get('/ver-pregunta', function(req, res) {
	if (req.session.user == null){
		res.redirect('/');
	}	else{
		let id_user = req.session.user[0].id_user;
		if(req.session.user[0].role!="admin"){
			mc.query('SELECT * FROM question where id_user= ?   order by id_question desc limit 1 ',[id_user], function (e, o) {
				if (e) res.status(400).send(e);
				var string=JSON.stringify(o);
				var json =  JSON.parse(string);
				req.session.user = json;
				return res.status(200).send(json);
			});
			res.render('verultimapregunta', { title : 'Ultima Pregunta', accts : accounts });
		}else{
			mc.query('SELECT * FROM question where id_user= ?   order by id_question desc limit 1 ',[id_user], function (e, o) {
				if (e) res.status(400).send(e);
				var string=JSON.stringify(o);
				var json =  JSON.parse(string);
				console.log("question",json);
				//res.render('verultimapregunta', { title : 'Ultima Pregunta', question : json });
			});
		
		}
		
		
	}
});
app.post('/responde-pregunta', function(req, res) {
	if (req.session.user == null){
		res.redirect('/');
	}	else{
		let id_user = req.session.user[0].id_user;
		let respuesta_1 = req.body['primera_pregunta'];
		let respuesta_2 = req.body['segunda_pregunta'];
		let respuesta_3 = req.body['tercera_pregunta'];
		mc.query("INSERT INTO question SET ? ", { id_user: id_user, respuesta_1: respuesta_1,respuesta_2:respuesta_2,respuesta_3:respuesta_3}, function (e, o, fields) {
			if (e){
				res.status(400).send('error-updating-account');
			}	else{
				res.status(200).send('ok');
			}
		});
	}
});
app.post('/logout', function(req, res){
	res.clearCookie('login');
	req.session.destroy(function(e){ res.status(200).send('ok'); });
})

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

