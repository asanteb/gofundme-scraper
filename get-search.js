var request = require('request');
var cheerio = require('cheerio');
var S = require('string');
var Campaign = require('./config_db/campaign.js');
var j2c = require('json2csv');
var lineReader = require('line-reader');
var sleep = require('system-sleep');
var fs = require('fs');

//var $ = require('jQuery');

var headers = {
    'User-Agent':       'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 7.0; InfoPath.3; .NET CLR 3.1.40767; Trident/6.0; en-IN)',
    'Content-Type':     'application/x-www-form-urlencoded'
};


module.exports = function(proxyAddress, search_key, work){
  var log = work + "ended with proxy: " + proxyAddress + " and zipcode: " + search_key;
  fs.writeFile("./temp/"+ work + ".txt", log, function(err) {
    if(err) {return console.log(err);}
    console.log(work + "was saved!");

  });

  for (var i = 0; i < 50; i++){
    var pageNumber = i + 1;
    var options = {
      url: 'https://www.gofundme.com/Medical-Illness-Healing?&page='+pageNumber+'&term='+search_key,
      method: 'GET',
      headers: headers
      //proxy: proxyAddress //'http://98.101.132.125:3128'
    };
  scrapePage(options);
  }

  // Start the request
  function scrapePage(options){
    request(options, function (error, response, body) {
      function startScrape(){
        var $ = cheerio.load(body,{ xmlMode: true});
        new_body = $('div[class=details]').html();

        //links = $('a').attr('href').text;
        //links = S(new_body).between('//www.gofundme.com/', '?ssid').toString();

        var objects = [];
        $('div[class=details]').each(function(i, elem){

          //LINKS

          this_body = $(this).html();
          unique_id = S(this_body).between('//www.gofundme.com/', '?ssid').toString();
          link = "https://www.gofundme.com/" + unique_id;

          //NAME

          name = S(this_body).between('>by ', '</').toString();
          var res = name.split(" ");
          var lastname;
          var firstname = res[0];

          if (res[2] !== null){
            lastname = res[1];
          }else {
            lastname = res[2];
          }

          //RAISED

          raised = S(this_body).between('>$', '</').toString();
          money = S(raised).between('', ' raised').toString();
          donors = S(raised).between('by ', ' donors').toString();

          //LOCATION

          location = S(this_body).between('uppercase;">', '</a').toString();
          var local = location.split(", ");
          var city = local[0]; var state = local[1];

          //TITLE

          title = S(this_body).between('title="Visit ','>').toString();

          //Build object

          var obj = {

              firstname : firstname,
              lastname : lastname,
              title : title,
              money : money,
              donors : donors,
              city : city,
              state : state,
              link : link,
              unique_id : unique_id
            };

            console.log(obj);

          Campaign.findOneOrCreate({'unique_id' : unique_id},
            {
              firstname : firstname,
              lastname : lastname,
              title : title,
              money : money,
              donors : donors,
              city : city,
              state : state,
              link : link,
              unique_id : unique_id
            },
            function(err, target){
              if (err) throw err;
            });
        });
      }
      if (!error && response.statusCode == 200) {
        body = S(body).between('<!-- Main Content Container -->','<!-- END c-->').toString();
        if(body.includes('No results found') === false){
          startScrape();
        }
      }
  });}

};
