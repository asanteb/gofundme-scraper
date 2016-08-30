var express   = require('express'),
    http      = require('http'),
    app       = express(),
    server    = http.createServer(app),
    mongoose  = require('mongoose'),
    configDB  = require('./config_db/database'),
    lineReader = require('line-reader'),
    every = require('schedule').every;
    zipcodes = require('./zipcodes/zipcodes');
//const readline = require('readline');

mongoose.connect(configDB.url);

//////////redacted till optomized


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

function proxyScrape(){
  require('./get-search')(proxy1, zipcode1);
  require('./get-search')(proxy2, zipcode2);
  require('./get-search')(proxy3, zipcode3);
  require('./get-search')(proxy4, zipcode4);
  require('./get-search')(proxy5, zipcode5);
  require('./get-search')(proxy6, zipcode6);
  require('./get-search')(proxy7, zipcode7);
  require('./get-search')(proxy8, zipcode8);
  require('./get-search')(proxy9, zipcode9);
  require('./get-search')(proxy10, zipcode10);
}



var search_key = 'cancer';

console.log(zipcodes);

//require('./get-search')(search_key);
//require('./proxy_config')(search_key);

console.log('Connected to port 8112');
server.listen(8112);
