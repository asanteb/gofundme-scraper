var request = require('request');
var unique_id = 'JonSnowLives';
// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

var message = 'Your story really resonated with me. You should look into this. It can definitely help.';
var name = 'http://healthfund.me';

// Configure the request
var options = {
    url: 'https://www.gofundme.com/mvc.php?route=donate/postcontact&url=' + unique_id,
    method: 'POST',
    headers: headers,
    form: {'Contact[firstname]': name, 'Contact[email]': 'therealcarlos@yahoo.com', 'Contact[message]' : message},
    proxy: 'http://186.93.111.76:8080'
};

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body);
    }
});
