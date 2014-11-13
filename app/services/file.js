function file(app, fs, gm, q) {
	return new function (){

		this.getFileNames = function (dir)
		{
			try {
				var files = fs.readdirSync(dir);
			} catch(err) {
				console.log(err);
			}
			
			var name = new Array();

		    for(var i in files){
		        if (!files.hasOwnProperty(i)) continue;
		        var nm = dir+'/'+files[i];
		        if (fs.statSync(nm).isDirectory()){
		            getFiles(name);
		        }else{
		            name.push(nm);
		        }
		    }

		    return name;
		}

	}();
}

module.exports = file;