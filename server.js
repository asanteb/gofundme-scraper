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



require('.//test-environment/post-contact');

console.log('Connected to port 8112');


server.listen(8112);
