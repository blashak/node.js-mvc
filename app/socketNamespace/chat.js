function chat (container) 
{
	return function(client) {

		var users = {}
		
		client.on('addUser', function (data) {
			client.username = client.id;
			users[client.id] = data.name;
		});

		client.emit('sendMessage', 'Welcome');
	
	};
}

module.exports = chat;