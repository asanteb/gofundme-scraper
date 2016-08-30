var request = require('request');
var fs = require('fs');

var headers = {
    'User-Agent':       'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 7.0; InfoPath.3; .NET CLR 3.1.40767; Trident/6.0; en-IN)',
    'Content-Type':     'application/x-www-form-urlencoded'
};

var options = {
  url: 'http://gimmeproxy.com/api/getProxy?get=true&supportsHttps=true&maxCheckPeriod=3600&anonymityLevel=0&country=US&user-agent=true&cookies=true&referrer=true',
  method: 'GET',
  headers: headers
};

request(options, function (error, response, body1) {
    proxyBody = JSON.parse(body1);
    proxy1 = proxyBody.curl;
    request(options, function (error, response, body2) {
        proxyBody = JSON.parse(body2);
        proxy2 = proxyBody.curl;
        request(options, function (error, response, body3) {
            proxyBody = JSON.parse(body3);
            proxy3 = proxyBody.curl;
            request(options, function (error, response, body4) {
                proxyBody = JSON.parse(body4);
                proxy4 = proxyBody.curl;
                request(options, function (error, response, body5) {
                    proxyBody = JSON.parse(body5);
                    proxy5 = proxyBody.curl;
                    request(options, function (error, response, body6) {
                        proxyBody = JSON.parse(body6);
                        proxy6 = proxyBody.curl;
                        request(options, function (error, response, body7) {
                            proxyBody = JSON.parse(body7);
                            proxy7 = proxyBody.curl;
                            request(options, function (error, response, body8) {
                                proxyBody = JSON.parse(body8);
                                proxy8 = proxyBody.curl;
                                request(options, function (error, response, body9) {
                                    proxyBody = JSON.parse(body9);
                                    proxy9 = proxyBody.curl;
                                    request(options, function (error, response, body10) {
                                        proxyBody = JSON.parse(body10);
                                        proxy10 = proxyBody.curl;

                                        str = '[' + '"' + proxy1 + '"' + ',' + '"' + proxy2 + '"' + ',' + '"' + proxy3 + '"' + ',' + '"' + proxy4 + '"' + ',' + '"' + proxy5 + '"' + ',' +
                                         '"' +proxy6 + '"' + ',' + '"' + proxy7 + '"' + ',' + '"' + proxy8 + '"' + ',' + '"' + proxy9 + '"' + ',' + '"' + proxy10 + '"' + ']';

                                        fs.writeFile("../temp/proxies.txt", str, function(err) {
                                          if(err) {return console.log(err);}

                                          console.log("The file was saved!");
                                        });

                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
