var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var Hashids = require('hashids');
var hashids = new Hashids('_W-Aubp8=v28Xyv~FX2fLGg_UgpOM0-Ele zbMKx0F hdFK-Ci0iaglN8OmF');

var RoomSchema = new Schema({
	
	topic: {
		type: String,
		required: true,
		default: 'No Topic'	
	}
	
});

RoomSchema.statics.findByPublicId = function(id, handle) {
	var actualId = hashids.decodeHex(id);
	console.log(actualId);
	this.findOne({_id: actualId}, handle);
};

RoomSchema.methods.getMessages = function(handle) {
	this.model('Message').find({room_id: this._id}, handle);
}

RoomSchema.plugin(timestamps);
module.exports = mongoose.model('Room', RoomSchema);