app.use(express.static(__dirname + '/public'));

app.get('/favicon.ico', function(req, res){
  });

  app.get('/hi', function(req, res){
      res.sendFile(__dirname + '/public/index.html');
      console.log('hi');
      var ip = req.headers['x-forwarded-for'] //||
        //req.connection.remoteAddress ||
        //req.socket.remoteAddress ||
        //req.connection.socket.remoteAddress
        ;
      console.log(ip);
  });
