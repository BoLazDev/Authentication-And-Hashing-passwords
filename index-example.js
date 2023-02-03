const bcrypt = require('bcrypt');

const hashPassword = async (pw) => {
    //const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pw, 12)
    //console.log("SALT :",salt);
    console.log("HASH :", hash);
}

const login = async (pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw);
    if(result) {
        console.log("LOGGED YOU IN! SUCCESSFUL MATCH!")
    }else {
        console.log("INCORECT!");
    }
}

login('monkey', '$2b$10$olsKDYAWMBeq9povnobtdOKNQ48CZDRUcW3EQHXJ5k.4.XZiiIugG');

hashPassword('monkey');


// Real Example
module.exports = {

	attributes: {
		status: {
			type: 'boolean',
			enum: ['true', 'false'],
			defaultsTo: 'true'
		},
		
		email: {
			type: 'string',
			unique: true
		},

		brand: {
			model: 'brand'
		},
				
		password: {
			type: 'string',
			//required: true,
			minLength: 6
		},	
		
		company: {
			collection: 'company',
			via: 'rep'
		},		

		franchise: {
			model: 'franchise'
		},
		
		accounts: {
			collection: 'Companyoffice',
			via: 'rep'
		},	

		offices: {
			collection: 'companyoffice',
			via: 'contacts'
		},
    					
		address: {
			collection: 'address',
			via: 'user'
		},	
	
		order: {
			collection: 'order',
			via: 'user'
		},

		role: {
			collection: 'role',
			via: 'user'
		},
		
		createdBy: {
			model: 'user'
		},
		
		updatedBy: {
			model: 'user'
		},

		new: {
			type: 'boolean',
			enum: ['true', 'false'],
			defaultsTo: 'true'
		},

		validated: {
			type: 'boolean',
			enum: ['true', 'false'],
			defaultsTo: 'false'
		},

		recover_password_id: {
			type: 'string',
			unique: true
		},

		recover_password_date: {
			type: 'datetime'
		},

		lastvisitedproducts: {
			collection: 'lastvisitedproducts',
			via: 'user'
		},
	},

	comparePassword: function(pval, pvalhash, cb) {
		bcrypt.compare(pval, pvalhash, function(err, res) {
			if (err || !res) { return cb(err); }

			return cb(false, true);
		});
	},
		
	beforeCreate: function(user, cb) {
		if('password' in user && '' != user.password) {
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(user.password, salt, function(err, hash) {
					if (err) { console.trace(err); cb(err); }
					
					user.password = hash;	
					delete user.passwordConfirm;
					cb(null, user);
				});
			});
		} else {
			cb();
		}
	},
	beforeUpdate: function(user, cb){
		if('password' in user && '' != user.password && 'rehash_password' in user) {
			bcrypt.genSalt(10, function(err, salt){
				bcrypt.hash(user.password, salt, function(err, hash){
					if(err) { console.trace(err); return cb(err); }

					user.password = hash;
					delete user.passwordConfirm;
					delete user.rehash_password;
					cb();
				});
			});
		} else {
			delete user.rehash_password;
			cb();
		}
	}
};
