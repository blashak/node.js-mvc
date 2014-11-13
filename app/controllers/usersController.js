function usersController(container) {
	
	var User = container.getModule('userModel');
	var security = container.getModule('security');
	var form = container.getModule('form');
	var validator = container.getModule('validator');

	return {

		update: function() {

			// Definition of variables
			var res = container.getModule('res');
			var req = container.getModule('req');

			// Check authentification
			security.ensureAuthenticated().then(function(user) {

				// Validate
				form.validateField({ name:'id', fn: { name:'compare', params: [req.body._id, user._id] }, text: 'INCORRECTID' })
				form.validateField({ name:'name', fn: { name:'checkLength', params: [req.body.name, 3, 30] }, text: 'INCORRECTNAME' })
				form.validateField({ name:'email', fn: { name:'isEmail', params: [req.body.email] }, text: 'INCORRECTEMAIL' })
				form.addField({ name:'oldpassword', fn: { params: [req.body.oldpassword], result: user.validPassword(req.body.oldpassword) }, text: 'INCORRECTOLDPASSWORD' })
				
				if (validator.exists(req.body.password)) {
					form.validateField({ name:'password', fn: { name:'isPassword', params: [req.body.password] }, text: 'INCORRECTPASSWORD' })
					form.validateField({ name:'password2', fn: { name:'compare', params: [req.body.password, req.body.password2] }, text: 'INCORRECTPASSWORD' })
				}

				if (form.checkError()) return res.status(400).send({ showWarning: true, fields: form.getFields() });

				var data = form.getFields();

				for (property in data) {
					switch (property) {
						case 'email':
							user.local.email = data[property];
							break;

						case 'oldpassword':
							if (validator.exists(req.body.password)) {
								user.local.password = user.generateHash(data[password]);
							} else { user.local.password = user.generateHash(data[property]); }
							user.local.token = User.generateToken(user.local.password);
							break;

						default:
							user[property] = data[property];
							break;
					}
				}
				
				user.save(function(err) {

					if (err && (err.err != undefined) && (err.err.search("duplicate key error index") != -1)) return res.status(409).send({ showWarning: true, fields: { email: { text: 'EMAILEXISTS', show: true } } });

					if (err) return res.status(500).send({ showModalDialog: true });

					res.set('Authorization', user.local.token.token);

					return res.status(200).json({ currentUser: { 
						_id: user._id,
						name: user.name, 
						email: user.local.email
					}});

				});
			});
		},

		

		delete: function() {

			// Definition of variables
			var res = container.getModule('res');
			var req = container.getModule('req');

			User.remove({ _id: req.params.id }, function(err) {
				res.json(true);
			});
		}

	};
}

module.exports = usersController;