function auth(route) {
	route.set('post', 'auth', '/local', 'auth', 'localLogin');
	route.set('post', 'auth', '/local-signup', 'auth', 'localSignup');
}

module.exports = auth;