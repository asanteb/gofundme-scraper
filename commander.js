var redis = require('redis');
var exec = require('child_process').exec;

for (var i = 0; i < 10; i++){
  exec('ruby test.rb', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    console.log('error: ' + error);
    if (error === null){
      console.log('Successfuly launched worker!');
    }
});}
