var request = require('request');
var unique_id = '2k99zak';
// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

// Configure the request
var options = {
    url: 'https://www.gofundme.com/mvc.php?route=donate/postcontact&url=' + unique_id,
    method: 'POST',
    headers: headers,
    form: {'Contact[firstname]': 'wrecker', 'Contact[email]': 'test@yahoo.com', 'Contact[message]' :'gotcha dude'}
};

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body);
    }
});
