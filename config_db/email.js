var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create');

var campaignSchema = mongoose.Schema({

    emailed       : Boolean,
    unique_link   : String,
    firstname     : String,
    lastname      : String,
    title         : String,
    money         : Number,
    link          : String,
    date_emailed  : Date

});

campaignSchema.plugin(findOneOrCreate);
module.exports = mongoose.model('emails2', campaignSchema);
