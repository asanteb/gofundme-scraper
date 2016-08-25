var Https = require('https');
var url = require('url');
var request = require('request');
var cheerio = require('cheerio');
var S = require('string');
var Campaign = require('./config_db/campaign.js');
var j2c = require('json2csv');
var lineReader = require('line-reader');
var HttpProxyAgent = require('http-proxy-agent');

var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

var options = {
  url: 'http://gimmeproxy.com/api/getProxy?get=true&supportsHttps=true&maxCheckPeriod=3600&anonymityLevel=0&port=80&country=US&user-agent=true&cookies=true&referrer=true',
  method: 'GET',
  headers: headers,
};

module.exports = function(search_key){


request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    proxyBody = JSON.parse(body);
    console.log(proxyBody.ipPort);
    var proxy = process.env.http_proxy || 'http://'+proxyBody.ipPort;

  console.log('using proxy server %j', proxy);
  var endpoint = process.argv[2] || 'https://www.gofundme.com';
  console.log('attempting to GET %j', endpoint);

  var opts = url.parse(endpoint);
  var agent = new HttpProxyAgent(proxy);

  Https.get(opts, function (res) {
    console.log('"response" event!', res.headers);
    res.pipe(process.stdout);
  });

  Https.request({
    host: 'https://www.gofundme.com/mvc.php?route=search&page='+'2'+'&term='+search_key,
    port: 443,
    method: 'GET',
    path: '/',
    agent: agent,
    header: "'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 7.0; InfoPath.3; .NET CLR 3.1.40767; Trident/6.0; en-IN)'"
  },
    function(res){
      res.on('data', function (data){
        function startScrape(){
          var $ = cheerio.load(data,{ xmlMode: true});
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
      console.log(data.string.toString());

    });
  }).end();


}else {
  console.log(error);
}
});
};
