var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create');

var campaignSchema = mongoose.Schema({


    firstname  : String,
    lastname   : String,
    title      : String,
    money      : String,
    donors     : String,
    city       : String,
    state      : String,
    link       : String,
    unique_id  : String

});

campaignSchema.plugin(findOneOrCreate);
module.exports = mongoose.model('fundraisers', campaignSchema);
