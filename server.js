var http = require('http');
var webpush = require('web-push');
var fs = require('fs');
http.createServer(function (req, res) {
  fs.readFile('.' + req.url , 'UTF-8', function(err, data){
    var extention = req.url.split('.')[1];
    console.log(req.url);
    if(req.url == '/vapidkey'){
      res.writeHead(200, {'content-Type': 'text/plain'});
      var vapidKeys = webpush.generateVAPIDKeys();
      res.end(vapidKeys.publicKey);
    }
    var content_type = 'text/plain';
    switch(extention){
      case 'html':
        var content_type = 'text/html';
        break;
      case 'js':
        var content_type = 'text/javascript';
        break;
      case 'jpg':
        var content_type = 'image/jpeg';
        break;
    }
    res.writeHead(200, {'Content-Type': content_type});
    res.end(data);
  });
}).listen(2000, '127.0.0.1');
