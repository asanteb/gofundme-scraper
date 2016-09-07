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
var proxy_list = ["http://70.248.28.13:8080","http://45.63.89.181:3128","http://162.255.66.53:8080","http://198.98.101.168:8080","http://208.111.7.125:8081",
                  "http://208.111.7.125:8081","http://198.23.143.27:8080","http://158.85.238.166:3128","http://158.85.238.166:3128","http://70.62.246.166:8080",
                  "http://50.251.136.177:8080","http://66.122.95.218:8080","http://208.111.7.125:8081","http://146.166.45.16:8080","http://168.9.40.10:8080",
                  "http://149.56.158.8:80","http://209.173.8.221:8080","http://54.164.192.252:3128","http://66.122.95.218:8080","http://108.58.40.245:80",
                  "http://162.255.66.53:8080","http://168.9.40.10:8080","http://198.98.101.168:8080","http://98.101.132.125:3128","http://198.23.143.27:8080",
                  "http://209.173.8.221:8080","http://209.173.8.221:8080","http://198.98.101.168:8080","http://204.29.115.149:8080","http://54.164.192.252:3128",
                  "http://190.204.197.168:8080","http://113.163.141.81:8080","http://168.63.20.19:8137","http://221.126.237.206:8080","http://195.2.214.91:8080",
                  "http://188.166.245.248:80","http://220.101.93.3:3128","http://212.155.230.208:8080","http://113.163.141.81:8080","http://168.63.24.174:8138",
                  "http://195.2.214.91:8080","http://168.63.20.19:8129","http://195.2.214.91:8080","http://195.2.214.91:8080","http://221.126.237.206:8080",
                  "http://80.80.160.252:8080","http://202.88.241.12:80","http://80.80.160.252:8080","http://202.164.38.11:8080","http://68.71.209.96:8000",
                  "http://37.48.84.198:8118","http://212.105.206.236:3128","http://200.255.220.211:8080","http://221.126.237.206:8080","http://217.76.204.197:8080",
                  "http://80.80.160.252:8080","http://186.93.111.76:8080","http://200.84.111.39:8089","http://80.80.160.251:8080","http://201.55.46.6:80",
                  "http://80.80.160.252:8080","http://190.6.38.198:8080","http://202.88.241.12:80","http://79.120.194.7:3128","http://221.126.237.206:8080",
                  "http://41.71.112.22:3128","http://137.135.166.225:8119","http://74.217.196.30:9797","http://166.70.157.58:80","http://166.70.157.58:80",
                  "http://137.135.166.225:8137","http://47.88.104.219:80","http://217.76.204.197:8080","http://87.117.193.78:8080","http://209.155.147.13:8080",
                  "http://137.135.166.225:8137","http://113.163.141.81:8080","http://181.142.206.215:8090","http://186.46.220.120:80","http://216.105.64.186:8080",
                  "http://195.2.214.91:8080","http://200.109.154.124:8080","http://168.63.20.19:8129","http://137.135.166.225:8122","http://137.135.166.225:8122",
                  "http://168.63.20.19:8129","http://200.255.220.211:8080","http://201.55.46.6:80","http://221.126.237.206:8080","http://201.55.46.6:80",
                  "http://74.217.196.30:9797","http://114.27.245.252:8998","http://12.33.254.195:3128","http://186.93.111.76:8080","http://36.82.106.174:8080",
                  "http://200.68.27.100:3128","http://209.155.147.13:8080","http://137.135.166.225:8137","http://137.135.166.225:8122","http://164.64.199.13:80"];
var proxy;

var chance = new Chance();

Campaign.find({'money' : {$eq : 0}}, function(err, obj){
  if (err) throw err;
  var i = 0; var v = 0;
  obj.forEach(function (campaign){
    i++;
    if (i > 70){
      v++;
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
