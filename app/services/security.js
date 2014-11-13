function security(container) {
	return {
		ensureAuthenticated: function() {
				
			// Definition of variables
			var res = container.getModule('res');
			var req = container.getModule('req');
			var mongoose = container.getModule('mongoose');
			var User = container.getModule('userModel');
			var q = container.getModule('q');
			var deferred = q.defer();

			if (req.headers.authorization == undefined) return res.status(401).send({ showModalDialog: true });

			var token = req.headers.authorization;

			User.findUserByToken(token, function(err, user) {

				if (err) return res.status(500).send({ showModalDialog: true });

				// if no user is found, return the message
				if (!user) return res.status(401).send({ showModalDialog: true });
				
				if (User.hasExpired(user.local.token.date)) {
					
					user.local.token = User.generateToken(user.local.password);

					user.save(function(err) {

						if (err) return res.status(500).send({ showModalDialog: true });

						res.set('Authorization', user.local.token.token);

						deferred.resolve(user);
					})
				} else { return deferred.resolve(user); }

			});

			return deferred.promise;
		}
	};
}

module.exports = security;