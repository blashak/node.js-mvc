/**
 * Module dependencies.
 */
var Container = require('./app/system/Container');
var container = new Container();
var app = container.getModule('app');
var http = container.getModule('http');
var bundle = container.getModule('bundle');
var config = container.getModule('config');
var io = container.getModule('io');
var socket = container.getModule('socket');
var server = http.createServer(app);


config.set(container);
bundle.registerModulesByBundles();
socket.init(server);
socket.loadModulesIntoSocket(bundle);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});