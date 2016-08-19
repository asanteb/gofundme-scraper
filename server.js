var express   = require('express'),
    http      = require('http'),
    app       = express(),
    server    = http.createServer(app),
    mongoose  = require('mongoose'),
    configDB  = require('./config_db/database'),
    lineReader = require('line-reader');

mongoose.connect(configDB.url);

function massSearch(){
  lineReader.eachLine('postal.txt', function(line, last) {

    var search_key = line;
    console.log('Searching postal code: ' + search_key);
    require('./get-search.js')(search_key);

    if (last){
      console.log('Searching postal code: ' + search_key);
      console.log('last zipcode');
      require('./get-search.js')(search_key);
    }
  });
}

massSearch();

console.log('Connected to port 8112');
server.listen(8112);
