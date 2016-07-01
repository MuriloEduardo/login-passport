var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var usuarioSchema = mongoose.Schema({
	local: {
		email: String,
		senha: String
	}
});

usuarioSchema.methods.generateHash = function(senha){
	return bcrypt.hashSync(senha, bcrypt.genSaltSync(9));
}

usuarioSchema.methods.validPassword = function(senha){
	return bcrypt.compareSync(senha, this.local.senha);
}

module.exports = mongoose.model('Usuario', usuarioSchema);