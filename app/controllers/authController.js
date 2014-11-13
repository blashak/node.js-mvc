function authController(container) {

	var User = container.getModule('userModel');
	var form = container.getModule('form');
	var validator = container.getModule('validator');

	return {

		localLogin: function() {

			// Definition of variables
			var res = container.getModule('res');
			var req = container.getModule('req');
			
			// Validate
			form.validateField({ name:'email', fn: { name:'isEmail', params: [req.body.email] } });
			form.validateField({ name:'password', fn: { name:'isPassword', params: [req.body.password] } });
			
			if (form.checkError()) return res.status(400).send({ showModalDialog: true });
			
			var data = form.getFields();

			// Looking for user
			User.findOne({ 'local.email' :  data.email }, function(err, user) {

				if (err) return res.status(500).send({ showModalDialog: true });

				// if no user is found, return the message
				if (!user) return res.status(404).send({ showModalDialog: true, code: 1 });
				
				// if the user is found but the password is wrong
				if (!user.validPassword(data.password)) return res.status(401).send({ showModalDialog: true, code: 1 });

				user.local.token = User.generateToken(user.local.password);
		        
		        user.save(function(err) {
					
					if (err) return res.status(500).send({ showModalDialog: true });

					res.set('Authorization', user.local.token.token);
					
					return res.status(200).send({
			          		_id: user._id, 
			          		name: user.name, 
			          		email: user.local.email
					});

		        });

			});
			
		},

		localSignup: function() {

			// Definition of variables
			var res = container.getModule('res');
			var req = container.getModule('req');

		    // Validate
			form.validateField({ name:'name', fn: { name:'checkLength', params: [req.body.name, 3, 30] }, text: 'INCORRECTNAME' });
			form.validateField({ name:'email', fn: { name:'isEmail', params: [req.body.email] }, text: 'INCORRECTEMAIL' });
			form.validateField({ name:'password', fn: { name:'isPassword', params: [req.body.password] }, text: 'INCORRECTPASSWORD' });
			form.validateField({ name:'password2', fn: { name:'compare', params: [req.body.password, req.body.password2] }, text: 'INCORRECTPASSWORD' });
			

			if (form.checkError()) return res.status(400).send({ showWarning: true, fields: form.getFields() });
			
			var data = form.getFields();

			User.findOne({ 'local.email' : data.email }, function(err, user) {

				if (err) return res.status(500).send({ showModalDialog: true });

				if (user) return res.status(409).send({ showWarning: true, fields: { email: { text: 'EMAILEXISTS', show: true } } });

				// Create the user
				var newUser = new User();
				
				for (property in data) {
					switch (property) {
						case 'email':
							newUser.local.email = data[property];
							break;

						case 'password':
							newUser.local.password = newUser.generateHash(data[property]);
							newUser.local.token = User.generateToken(newUser.local.password);
							break;

						default:
							newUser[property] = data[property];
							break;
					}
				}

				// save the user
				newUser.save(function(err) {

					if (err) return res.status(500).send({ showModalDialog: true });
				
					res.set('Authorization', newUser.local.token.token);

					return res.status(200).send({
						_id: newUser._id, 
						name: newUser.name, 
						email: newUser.local.email
					});
				
				});

			})
		}		

	};
}

module.exports = authController;