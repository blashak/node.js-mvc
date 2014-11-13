function validator() {
	return {
		isUndefined: function(value) {
			if (value === undefined) return true; else return false;
		},

		isNull: function(value) {
			if (value === null) return true; else return false;	
		},

		isEmpty: function(value) {
			if (value === '') return true; else return false;
		},

		exists: function(value) {
			if (!this.isUndefined(value) && !this.isNull(value)) return true; else false;
		},

		checkLength: function(value, min, max) {
			if (!this.exists(value)) return false;
    		if (value.length >= min && value.length <= max) return true; else return false;
		},

		checkArray: function(value) {
			if (!this.exists(value)) return false;
			if (value.length > 0) return true; else return false;
		},

		isEmail: function(value) {
    		if (/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value))
				return true;
			else
				return false;
		},

		isPassword: function(value) {
			if (!this.exists(value)) return false;	
			var regExPattern = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,15})$/;
			if(regExPattern.test(value)) return true; else return false;
    	},

    	compare: function(p1,p2) {
    		if (p1 != p2) return false; else return true;
    	},

    	isData: function(value) {
			var re =/^[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]$/
			if((value !== undefined) && !re.exec(value)) return true; else return false;
    	},

    	dateDiff: function(d1, d2) {

			if(typeof(d1) == 'undefined') return false;
			if(typeof(d2) == 'undefined') return false;

			if(typeof(d1) == 'string')
				d1 = new Date(Date.parse(d1.replace(/"/g, '')));

			if(typeof(d2) == 'string')
				d2 = new Date(Date.parse(d2.replace(/"/g, '')));

			var d3 = new Date(); // hora actual
			var difference = d1.getTime() - d3.getTime();

			var seconds = Math.floor(difference / 1000);
			var minutes = Math.floor(seconds / 60);
			var hours = Math.floor(minutes / 60);   
			var days = Math.floor(hours / 24);
			var years = Math.floor(days / 365);
			
			if(hours < 3) return false;
			
			var difference = d2.getTime() - d1.getTime();

			var seconds = Math.floor(difference / 1000);
			var minutes = Math.floor(seconds / 60);
			var hours = Math.floor(minutes / 60);   
			var days = Math.floor(hours / 24);
			var years = Math.floor(days / 365);

			if(hours < 1)
				return false
			else
				return true;

    	},

    	isBirthDate: function(value) {
    		if (!this.isData(value)) return false;

    		var d1 = new Date(value);
			var d2 = new Date()

			var difference = d2.getTime() - d1.getTime();
			var seconds = Math.floor(difference / 1000);
			var minutes = Math.floor(seconds / 60);
			var hours = Math.floor(minutes / 60);   
			var days = Math.floor(hours / 24);
			var years = Math.floor(days / 365);
			
			if (years < 8) return false; 

			return true;
    	},

    	isRadio: function(value, values) {
    		if (!this.exists(value)) return false;

    		var exists = false;
    		for (var i = 0; i < values.length; i++) {
    			if (values[i] == value) {
    				exists = true;
    				break;
    			}
    		}

    		return exists;
    	},

    	isCoordinates: function(value) {
    		if (typeof(value) != 'object') return false;
    		if (value.length != 2) return false; else return true;  
    	},

    	isFile: function(value) {
    		if (value.file != undefined) return true; else return false;
    	}

	}
}

module.exports = validator;