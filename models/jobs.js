var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobs = new Schema({
	 jobId : {type: String, unique:true}
});

module.exports= mongoose.model('Jobs',jobs);
