function Database(container)
{
	this.load = function(connections)
	{
		for (var propertyName in connections) {
			this[propertyName] = this[propertyName](connections[propertyName]);
		}
	}
	
	this.mysql = function(obj) 
	{
		var mysql = container.getModule('mysql');

		return {
			adapter: container.getModule('mysql'),
			connection: mysql.createConnection(obj),
		}
	}

	this.mongo = function(obj) 
	{
		var mongoose = container.getModule('mongoose');

		return {
			adapter: mongoose,
			connection: mongoose.connect('mongodb://'+obj.host),
			Schema: mongoose.Schema
		}
	}
}

module.exports = Database;