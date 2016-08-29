var express   = require('express'),
    http      = require('http'),
    app       = express(),
    server    = http.createServer(app),
    mongoose  = require('mongoose'),
    configDB  = require('./config_db/database'),
    lineReader = require('line-reader'),
    every = require('schedule').every;
//const readline = require('readline');

mongoose.connect(configDB.url);

//////////redacted till optomized

function getArray(){
  var i = 0;
  zipcodes = [];

  lineReader.eachLine('postal.txt', function(line, last) {

    zipcodes[i] = line;
    i++;

    if (last){
      zipcodes[i] = line;
      console.log('last zipcode');
      console.log(zipcodes);


    }
  });
}

//////////////////////
//massSearch();

//search by key input
/*
function input_search(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter search word ', (search_key) => {
    console.log('Scraping results for: ', search_key);
    require('./get-search.js')(search_key);
  rl.close();
}); console.log('Please wait 5 minutes before searching again');}

input_search();

every('300s').do(input_search);
*/

getArray();

var search_key = 'cancer';

//require('./get-search')(search_key);
//require('./proxy_config')(search_key);

console.log('Connected to port 8112');
server.listen(8112);
