function userModel(mongoose, bcrypt, jwt) {

    var userSchema = mongoose.Schema({

        local            : {
            email        : {type: String, unique: true},
            password     : String,
            token        : Object
        }
        name: String,
        createdAt: {type: Date, default: Date.now}
    });

    //generateResetToken
    userSchema.statics.generateToken = function(email) {
        
        var dt = Date.now();

        return {
            token: jwt.sign(email+dt, 'xxx', { expiresInMinutes: 60 }),
            date: dt
        }
    }


    /**
         * Millis conversions cheat sheet:
         * 1 second: 1000
         * 1 minute: 60000
         * 10 minutes: 600000
         * 30 minutes: 1800000
         * 1 hour: 3600000
         * 12 hours: 43200000
         * 24 hours: 86400000
         * 1 week: 604800000
         */
    userSchema.statics.hasExpired = function(created) {
        var now = new Date();
        var diff = (now.getTime() - created);
        return diff > 3600000; //1 hour
    };


    // methods ======================
    // generating a hash
    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.local.password);
    };

    userSchema.statics.findUserByToken = function(token, cb) {
        console.log("req.headers.authorization");
        this.findOne({'local.token.token': token}, function(err, usr) {
            if(err || !usr) {
                cb(err, null);
            } else {
                cb(false, usr);
            }
        })
    }
    
    var User = mongoose.model('User', userSchema);

    return User;
}

module.exports = userModel;