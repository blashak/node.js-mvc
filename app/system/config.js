exports.set = function(container) {
		
		var app = container.getModule('app');
		var express = container.getModule('express');
		var path = container.getModule('path');
		var favicon = container.getModule('favicon');
		var logger = container.getModule('logger');
		var bodyParser = container.getModule('bodyParser');
		var busboy = container.getModule('busboy');
		var errorHandler = container.getModule('errorHandler');
		var multer = container.getModule('multer');
		var database = container.getModule('database');

		app.set('realPath', path.resolve(__dirname+'/../'));

		app.set('bundles',{
		  services: ['file', 'validator', 'security', 'form'],
		  models: ['userModel', 'eventModel'],
		  controllers: ['authController', 'usersController', 'eventsController'],
		  socketNamespace: ['chat', 'root'],
		  routes: ['auth', 'users', 'events']
		});
		
		//Config all environments
		
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');

		app.use(favicon());
		app.use(logger('dev'));

		app.use(bodyParser.json());// get information from html forms
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser({
		 	keepExtensions: true,
		    uploadDir: __dirname + '/../../tmp',
		    limit: '2mb'
		}));
		app.use(bodyParser());
		app.use(busboy()); 
		app.use('/public', express.static(app.get('realPath') + "/../public"));//-->permite ver las imagenes
		app.use(multer({ dest: app.get('realPath') + "/../public/images/tmp/" }))

		//CORS middleware
		app.use(
			function(req, res, next) {
			  // Website you wish to allow to connect
			  res.header("Access-Control-Allow-Origin", "*");
			  // Request methods you wish to allow
			  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD'); 
			  // Request headers you wish to allow
			  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

			  res.header('Access-Control-Expose-Headers', 'Authorization');
			  // Pass to next layer of middleware
			  next();
			}
		)
	
		var connections = {};
		var env = process.env.NODE_ENV || 'development';
		var port; 

		switch(env){
	        case 'development':

	        	port = 4000;
	        	app.use(errorHandler({ dumpExceptions: true, showStack: true }))
				console.log("entorno: development");

				connections.mysql = {
					host: 'localhost',
					user: 'root',
					password: 3306,
					database: 'mvc'
				}

				connections.mongo = {
					host: 'localhost/mvc'
				}

				break;

	        case 'production':
	        	port = 6000;
	        	app.use(errorHandler());
				console.log("entorno: produccion");

				break;
	    }		

	    port = process.env.PORT || port;
		app.set('port', port);

		database.load(connections);
}