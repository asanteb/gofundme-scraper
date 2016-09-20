var request   = require('request');
var Chance = require('chance');
var Campaign      = require('../config_db/campaign');
var Email = require('../config_db/email');
// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

var message = 'Your story really resonated with me. You should look into this. It can definitely help.';
var name = 'http://healthfund.me';
var email = '';
var proxy_list = ["http://137.135.166.225:8121","http://64.20.54.213:8080","http://220.225.245.109:8000","http://185.104.93.122:8080","http://159.203.87.251:8080","http://96.230.117.77:80","http://202.164.38.11:8080","http://201.7.216.85:3128","http://66.171.203.124:9797","http://104.237.225.166:3128","http://204.13.205.149:8080","http://52.74.64.172:80","http://193.22.84.68:3128","http://62.40.157.83:8080","http://36.231.182.91:8998","http://187.167.87.62:8080","http://187.20.88.126:8080","http://175.101.95.132:8080","http://204.13.205.149:8080","http://45.58.36.161:80","http://217.76.204.197:8080","http://80.80.160.252:8080","http://97.77.104.22:3128","http://217.76.204.197:8080",
"http://185.104.93.122:8080","http://159.203.87.251:8080","http://204.13.205.130:8080","http://36.231.182.91:8998","http://177.184.171.11:8080","http://14.38.168.203:8080","http://96.230.117.77:80","http://193.22.84.68:3128","http://217.76.204.197:8080","http://203.176.136.42:8080","http://45.58.36.161:80","http://159.203.87.251:8080","http://176.195.111.249:8080","http://217.76.204.197:8080","http://176.195.111.249:8080","http://177.184.171.11:8080","http://220.225.245.109:8000","http://201.7.216.85:3128","http://200.5.196.227:3128","http://151.236.12.42:3128","http://66.171.203.124:9797","http://193.22.84.68:3128","http://217.76.204.197:8080","http://175.101.95.132:8080",
"http://187.20.88.126:8080","http://173.68.185.170:80","http://190.37.50.93:8089","http://47.88.104.219:80","http://64.20.54.213:8080","http://168.63.24.174:8129","http://204.13.205.143:8080","http://204.13.205.130:8080","http://66.98.34.2:8080","http://114.25.35.29:808","http://83.212.115.197:3128","http://217.76.204.197:8080","http://204.13.205.143:8080","http://66.98.34.2:8080","http://2.180.23.177:80","http://190.151.32.18:8080","http://190.151.32.18:8080","http://121.167.151.57:8080","http://217.76.204.197:8080","http://204.13.205.152:8080","http://204.13.205.130:8080","http://190.151.32.18:3128","http://36.231.182.91:8998","http://62.40.157.83:8080","http://114.25.35.29:808",
"http://81.90.192.2:8080","http://190.37.50.93:8089","http://174.108.45.195:8080","http://66.171.203.124:9797","http://41.205.60.159:8080","http://187.20.88.126:8080","http://173.68.185.170:80","http://173.68.185.170:80","http://80.80.160.251:8080","http://203.176.136.42:8080","http://185.28.193.95:8080","http://64.20.54.213:8080","http://203.176.136.42:8080","http://176.195.111.249:8080","http://190.151.32.18:8080","http://204.13.205.149:8080","http://190.151.32.18:3128","http://201.7.216.85:3128","http://175.136.218.127:8080","http://174.108.45.195:8080","http://114.25.35.29:808","http://168.63.24.174:8129","http://193.22.84.68:3128","http://108.59.10.129:55555","http://45.58.36.161:80",
"http://220.225.245.109:8000","http://204.13.205.152:8080"];
var proxy;

var chance = new Chance();

Campaign.find({'money' : {$lt : 300}}, function(err, obj){
  if (err) throw err;
  var i = 0; var v = 0;
  obj.forEach(function (campaign){
    i++;
    if (i > 70){
      v++;
      if (v == 7){v=0;}
      i = 0;
    }
    proxy = proxy_list[v];
    ////////////////
    Email.findOneOrCreate({'unique_link' : campaign.unique_link},
    {
      emailed       : false,
      unique_link   : campaign.unique_link,
      firstname     : campaign.firstname,
      lastname      : campaign.lastname,
      title         : campaign.title,
      money         : campaign.money,
      link          : campaign.link,
      date_emailed  : ''
    },
      function(err, fundraiser){
        if (err) throw err;
        var email = chance.email({domain : 'gmail.com'});

        if (fundraiser.emailed === false){
          var options = {
            url: 'https://www.gofundme.com/mvc.php?route=donate/postcontact&url=' + fundraiser.unique_link,
            method: 'POST',
            headers: headers,
            form: {'Contact[firstname]': name, 'Contact[email]': email, 'Contact[message]' : message},
            proxy: proxy
          };

          console.log("--> " + fundraiser.unique_link + ' ' + options.form);

          request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
            // Print out the response body
              console.log(body);
              if (body == 'JS,contactsent()'){
              fundraiser.emailed = true;
              fundraiser.date_emailed = Date.now();
              fundraiser.save();
              console.log('Message Sent');
              }
            }});}
      });
    });
});
