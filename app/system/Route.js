function Route(container) 
{
		this.set = function(method, name, path, controller, action)
		{

			var controller = container.getModule(controller+'Controller');
			var app = container.getModule('app');
			var express = container.getModule('express');
			var router = express.Router();			

			router[method](path, function(req, res, next) {
				container.registerModule('req', req);
				container.registerModule('res', res);
				controller[action]();
			});
				
			app.use('/'+name, router)
			
			/*if (this.isMethodDefined(method)) {

			}*/
		}

		this.isMethodDefined = function(method)
		{
			if (method == ('get' || 'post' || 'put' || 'delete'))
				return true;
		}
}

module.exports = Route;

