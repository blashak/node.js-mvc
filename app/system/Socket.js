function Socket(container)
{
	this.init = function(server)
	{
		io = container.getModule('io');
		io = io.listen(server);
	}

	this.loadModulesIntoSocket = function(bundle)
	{
		modules = this.getBundleSocketNamespace(bundle);
		
		for (module in modules) {
			var fn = container.getModule(modules[module]);
			var modulename = modules[module];

			connection(fn, this.generateNamespace(modulename));
		}
	}

	this.getBundleSocketNamespace = function(bundle)
	{
		return bundle.getSpecificBundle('socketNamespace');
	}

	this.generateNamespace = function(modulename)
	{
		if (this.isRoot(modulename))
			return '';
		else
			return '/'+modulename;
	}

	this.isRoot = function(modulenam)
	{
		if (modulenam == 'root')
			return true;
	}

	var connection = function(fn, namespace)
	{
		if (isEmptyPropertyNamespace(namespace) == true)
			io.sockets.on('connection', fn);
		else
			io.of(namespace).on('connection', fn);
	}

	var isEmptyPropertyNamespace = function(namespace)
	{
		if (namespace == '')
			return true;			
	}
}

module.exports = Socket;