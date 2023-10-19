/**
 * 
 */
var env = process.env.NODE_ENV || "development";

const logger = require('../logger');
const mongoose = require('mongoose');
const config = require('../config/config');
const uuid = require('uuid');
const _ = require('lodash');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
}
logger.info(`mongo: ${config.mongoDbEndpoint}`)
mongoose.connect(config.mongoDbEndpoint, options).
    then(() => {logger.info('user model connected to Mongo Db');}).
    catch(error => handleConnectError(error));
const db=mongoose.connection;
db.on('error', function(e) {
	logger.error('user connection error:')
});
db.once('open', function () {
	logger.info('user successfully connected to Mongo Db');
});

var userSchema = new mongoose.Schema({
	// userId : {type: String, index: true, unique: true},
	first_name : { type: String },
	last_name : { type: String },
	nickname : { type: String },
	encryptedPass : { type: String },
	email : { type: String, index: true, unique: true },
	username : { type: String, index: true, unique: true },
	phone : { type: String },
	apikey : { type: String, index: true, unique: true },
	device_token : { type: String },
	authToken: {type: String, index: true, required: false},
	authTokenDate: {type: Date},
	createdAt : { type: Date },
	updatedAt : { type: Date },
	lastLogin : { type: Date },
}, {
  // methods: {
  //   setPassword(unencrypted) {
  //     this.encryptedPass = bcrypt.hashSync(unencrypted,saltRounds);
  //     return this;
  //   }
  // }
});

userSchema.pre('update', function(next) {
//	this.update({},{ $set: { updatedAt: new Date() } });
//	console.log('user will update: ');
	this.updatedAt=new Date();
//	console.log('user before update: ');
	next();
});
userSchema.pre('save', function(next) {
	// if (!this.passEncrypted && this.encryptedPass) {
	// 	logger.debug("encrypting '"+this.encryptedPass+"' for "+this.email);
	// 	this.encryptedPass = bcrypt.hashSync(this.encryptedPass,saltRounds);
	// 	this.passEncrypted=true;
	// }
	// if (!this.userId) {
	// 	this.userId=uuid.v4();
	// }
	if (!this.apikey) {
		this.apikey=uuid.v4();
	}
	if (!this.createdAt) {
		this.createdAt=new Date();
		this.updatedAt=new Date();
	}
	next();
});

userSchema.methods.verifyPassword = function (password) {
	return bcrypt.compareSync(password, this.encryptedPass) ;
};
userSchema.methods.setPassword = function(unencrypted) {
  this.encryptedPass = bcrypt.hashSync(unencrypted,saltRounds);
  return this;
}
userSchema.methods.tokenValid = function (cb) {
	if (!_.isNil(this.authToken) && !_.isNil(this.authTokenDate)) {
		return authTokenDate>Date.now()
	}
	return false;
}
userSchema.methods.cookieRef = function () {
	return {
		user_id: this.user_id,
		authToken: this.authToken,
		authTokenDate: this.authTokenDate
	};
}
userSchema.methods.exposedData = function() {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    first_name: this.first_name,
    last_name: this.last_name,
  };
}

var UserModel = mongoose.model('User',userSchema);
module.exports = UserModel;
module.exports.UserModel = UserModel;
go = async function() {
  await UserModel.createCollection();
}()

module.exports.findByUserId = async (id) => {
	return UserModel.findOne({'_id':id})
}

module.exports.findByUsername = async (username) => {
	return UserModel.findOne({'username':username})
}

module.exports.disconnect = async () => {
	return await mongoose.disconnect()
}

handleConnectError = function(err) {
  logger.error(`error connecting ${err}`)
}

// module.exports.findByUserId = function(uid) {
//   return UserModel.findOne({'user_id':uid});
// };
//
// module.exports.findByEmailOrUsername = function(emailOrUsername) {
// 	logger.info("find user: "+emailOrUsername);
// 	return UserModel.findOne({$or:[{'email':emailOrUsername},{'username':emailOrUsername}]});
// };
//
// //callback is func(err,adminUser)
// var getAdminUserFunc = function(cb) {
// 	return UserModel.findOne({'email':'admin@johnjfowler.com'});
// };
// module.exports.getAdminUser = getAdminUserFunc;
//
// module.exports.findByAuthToken = function(token,cb) {
// //logger.info("find user by authtoken: "+token);
// 	return UserModel.findOne({'authToken':token});
// };


