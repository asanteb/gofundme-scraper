var zipcodes = require('../zipcodes/zipcodes');
var sleep = require('system-sleep');


var length = zipcodes.length;

for (var i = 0; i < 10; i++){

  console.log('hello', i);
  sleep(5000);

}

console.log(length);
