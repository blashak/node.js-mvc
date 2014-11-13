function users(route) {
	route.set('put', 'users', '/:id', 'users', 'update');
	route.set('delete', 'users', '/:id', 'users', 'delete');
}

module.exports = users;