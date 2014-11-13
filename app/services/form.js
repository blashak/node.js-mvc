function form(validator) {

	var error = false;
	var fields = {};

	return {

		validateField: function(field) {
			field.fn.result = validator[field.fn.name].apply(validator, field.fn.params);
			this.addField(field);
		},

		addField: function(field) {
			if (!field.fn.result) {
				error = true;
				if (field.text !== undefined) fields[field.name] = { text: field.text, show: true };
			} else { fields[field.name] = field.fn.params[0] }
		},
		
		checkError: function() {
			if (error) {
				error = false;
				return true;
			} else return false;
		},

		getFields: function() {
			return fields;
		}
	}
}

module.exports = form;