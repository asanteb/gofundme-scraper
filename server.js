var express   = require('express'),
    http      = require('http'),
    app       = express(),
    server    = http.createServer(app),
    mongoose  = require('mongoose'),
    configDB  = require('./config_db/database'),
    lineReader = require('line-reader'),
    every = require('schedule').every;
    zipcodes = require('./zipcodes/zipcodes');
    proxy = require('./proxy/proxy.js');
    sleep = require('system-sleep');

//const readline = require('readline');

mongoose.connect(configDB.url);

/*
function proxyScrape(zipcode1,zipcode2,zipcode3,
                     zipcode4,zipcode5,zipcode6,
                     zipcode7,zipcode8,zipcode9,zipcode10)
                     {
  require('./get-search')(proxy[0], zipcode1, 'work1');
  require('./get-search')(proxy[1], zipcode2, 'work2');
  require('./get-search')(proxy[2], zipcode3, 'work3');
  require('./get-search')(proxy[3], zipcode4, 'work4');
  require('./get-search')(proxy[4], zipcode5, 'work5');
  require('./get-search')(proxy[5], zipcode6, 'work6');
  require('./get-search')(proxy[6], zipcode7, 'work7');
  require('./get-search')(proxy[7], zipcode8, 'work8');
  require('./get-search')(proxy[8], zipcode9, 'work9');
  require('./get-search')(proxy[9], zipcode10, 'work10');
  console.log('Starting Scrapers');
}

var a = 0,
    b = 92,
    c = 184,
    d = 276,
    e = 368,
    f = 460,
    g = 552,
    h = 644,
    i = 736,
    j = 828;

for (var i = 0; i < 92; i++){
  proxyScrape(zipcodes[a],zipcodes[b],zipcodes[c],zipcodes[d],
              zipcodes[e],zipcodes[f],zipcodes[g],zipcodes[h],
              zipcodes[i],zipcodes[j]);
  a++; b++; c++; d++; e++;
  f++; g++; h++; i++; j++;
}

function pleaseSleep(){
  sleep(240000);
  console.log('resting');
}
*/

var search_key = 'miami';

//every('240s').do(pleaseSleep);
//for(var i = 800; i > 0; i--){
  //require('./get-search')(proxy[0], zipcodes[i], 'work1');
//}
require('./get-search')(proxy[2],search_key, 'blank');
//require('./proxy_config')(search_key);

console.log('Connected to port 8112');
server.listen(8112);
