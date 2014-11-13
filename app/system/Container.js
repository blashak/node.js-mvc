function Container()
{
	objects = Array();

	this.constructor = function() 
	{
		/**
		 * Module dependencies.
		 */

		var express = require('express');
		var app = express();
		var path = require('path');
		var favicon = require('static-favicon');
		var logger = require('morgan');
		var bodyParser = require('body-parser');
		var busboy = require('connect-busboy');  //middleware for form/file upload
		var errorHandler = require('errorhandler');
		var bcrypt = require('bcrypt-nodejs');
		var jwt = require('jsonwebtoken');

		var fs = require('fs');
		var mysql = require('mysql');
		var mongoose = require( 'mongoose');
		var io = require( 'socket.io');
		var config = require('./config');
		var Bundle = require('./Bundle');
		var Database = require('./Database');
		var Route = require('./Route');
		var Socket = require('./Socket');
		var gm = require('gm');
		var q = require('q');
		var multer = require('multer');

		this.registerModule('container', this);
		this.registerModule('express', express);
		this.registerModule('app', app);
		this.registerModule('http', require('http'));
		this.registerModule('path', path);
		this.registerModule('favicon', favicon);
		this.registerModule('logger', logger);
		this.registerModule('bodyParser', bodyParser);
		this.registerModule('busboy', busboy);
		this.registerModule('errorHandler', errorHandler);
		this.registerModule('bcrypt', bcrypt);
		this.registerModule('jwt', jwt);



		this.registerModule('fs', fs);
		this.registerModule('mysql', mysql);
		this.registerModule('mongoose', mongoose);
		this.registerModule('io', io);
		this.registerModule('config', config);
		this.registerModule('bundle', new Bundle(this.getModule('container')));
		this.registerModule('database', new Database(this.getModule('container')));
		this.registerModule('route', new Route(this.getModule('container')));
		this.registerModule('socket', new Socket(this.getModule('container')));
		this.registerModule('gm', gm);
		this.registerModule('q', q);
		this.registerModule('multer', multer);
	}

	this.registerModule = function(key, value)
	{
		objects[key] = value;
	}

	this.getModule = function(key)
	{
		if (this.isRegisterModule(key))
			return objects[key]
		else
			return null
	}

	this.isRegisterModule = function(key) 
	{
		if (objects[key] != undefined)
			return true;
	}

	this.unRegisterModule = function(key) 
	{
		delete objects[key];	
	}

	this.constructor();
}

module.exports = Container;