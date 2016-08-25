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
/*
function massSearch(){
  lineReader.eachLine('postal.txt', function(line, last) {

    var search_key = line;
    console.log('Searching postal code: ' + search_key);
    require('./get-search.js')(search_key);

    if (last){
      console.log('Searching postal code: ' + search_key);
      console.log('last zipcode');
lo    }
  });
}
*/
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

app.use(express.static(__dirname + '/public'));

app.get('/favicon.ico', function(req, res){
  });

  app.get('/hi', function(req, res){
      res.sendFile(__dirname + '/public/index.html');
      console.log('hi');
      console.log('IP is: ' + req.connection.remoteAddress);
  });

var search_key = 'cancer';

//require('./get-search')(search_key);
//require('./proxy_config')(search_key);

//console.log('Connected to port 8112');
server.listen(8112);
