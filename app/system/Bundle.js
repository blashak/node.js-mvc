function Bundle (container) 
{

	/**
	*	get all bundles
	**/
	this.getAll = function () 
	{
		var app = container.getModule('app');
		return app.get('bundles');
	}

	/**
	*	Load all bundles
	**/
	this.registerModulesByBundles = function () {	

		var bundles = this.getAll();

		for (bundle in bundles) {
			
			var modules = bundles[bundle];

			for (module in modules) {

				if (container.getModule(modules[module]) != null)
					continue;
				this.read(bundle, modules[module]);
			}

		}
	}

	/**
	*	Create an registre bundle
	**/
	this.read = function (bundle, name) {
		
		var app = container.getModule('app');
		var realPath = app.get('realPath');
		var dependency = app.get('dependency');

		var obj = {
			bundle: bundle,
			name: name,
			path: realPath+'/'
		};

		console.log(obj.path+obj.bundle+'/'+obj.name);
		
		obj.fn = require(obj.path+obj.bundle+'/'+obj.name); // Load file
		obj.arguments = this.getArguments(obj.fn); // Load function's arguments
		this.setDependencies(obj);
		container.registerModule(obj.name, obj.fn.apply(null, obj.dependencies));

		return container.getModule(obj.name);
	}

	/**
	*	Search arguments into function
	**/
	this.getArguments = function (obj) {

		var pattern = /(\(){1}([\s\w,])*(\)){1}/g;
		var val = obj.toString().match(pattern);

		if (val.length >= 1) var v = val[0].replace(/([\(\)]){1}/g, '');

		if (v != undefined && v != '') {
			return v.split(','); 
		} else 
			return new Array();
	}

	/**
	*	Get dependencies
	**/
	this.setDependencies = function (obj) {

		var arguments = obj.arguments;
		var app = container.getModule('app');

		obj.dependencies = new Array();

		for (x = 0;  x < arguments.length; x++) {

			var argument  = arguments[x].trim();
			var dependency = container.getModule(argument);

			if (dependency == null) {

				bundle = this.findBundleByModule(argument);

				dependency = this.read(bundle, argument);
			}

			obj.dependencies[x] = dependency;
		}

		if (obj.dependencies.length <= 0) obj.dependencies = null;
	}
	
	this.findBundleByModule = function (argument)
	{

		var bundles = this.getAll();

		for (bundle in bundles) {

			var modules = bundles[bundle];

			for (module in modules) {
				
				if (modules[module] == argument) {

					return bundle;
				}
			}
		}
	}

	this.getSpecificBundle = function (bundle) 
	{
		var bundles = this.getAll();

		return bundles[bundle];
	}

}
module.exports = Bundle;