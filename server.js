var http = require('http');
var webpush = require('web-push');
var fs = require('fs');
http.createServer(function (req, res) {
  fs.readFile('.' + req.url , 'UTF-8', function(err, data){
    var extention = req.url.split('.')[1];
    if(req.url == '/vapidkey'){
      res.writeHead(200, {'content-Type': 'text/plain'});
      
      /*var vapidKeys = webpush.generateVAPIDKeys();
      fs.writeFile('privateKey/privateKey.txt', vapidKeys.privateKey);
      fs.writeFile('publicKey/publicKey.txt', vapidKeys.publicKey);
      */
      var publicKey = fs.readFileSync('publicKey/publicKey.txt', 'utf-8');
      console.log(publicKey);
      res.end(publicKey);
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

function encodeBase64URL(data) {
  let output = '';
  for(i in data){
    output += String.fromCharCode(data[i]);
  }
  return btoa(output.replace(/\+/g, '-').replace(/\//g, '_')).replace(/=+$/, '');
}

function btoa(str) {  
  var buffer;
  if (Buffer.isBuffer(str)) {
    buffer = str;
  }
  else {
    buffer = new Buffer(str.toString(), 'binary');
  }

  return buffer.toString('base64');
};