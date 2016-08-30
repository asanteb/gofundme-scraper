var lineReader = require('line-reader');
var unique = require('array-unique');
var fs = require('fs');

var i = 0;
var zipcodes = [];

lineReader.eachLine('postal.txt', function(line, last) {

  var res = line.replace('"','');
  var newline = res.slice(0, 3);
  console.log(newline);
  zipcodes[i] = newline+'01';

  i++;

  if (last){

    newline = line.slice(0, 3);
    zipcodes[i] = newline+'01';

    var uniqueZips = unique(zipcodes);

    console.log('last zipcode');
    console.log(uniqueZips);

    length = uniqueZips.length;
    var str = '"0' + uniqueZips[0] + '",';

    for (var j = 1; j < length; j++){
      str = str + ' "' + uniqueZips[j] + '"' + ',';
    }


    fs.writeFile("../temp/zipcodes.txt", str, function(err) {
      if(err) {return console.log(err);}

      console.log("The file was saved!");
    });


  }
});
