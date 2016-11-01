var http = require('http');
var fs = require('fs');
const webpush = require('web-push');
var fetch = require('node-fetch');
var jsonObj = null;
const apiKey = 'AIzaSyBxVBLQyEIX6rRy5upkg5HRiG8ELFV_zro';

const vapidKeys = webpush.generateVAPIDKeys();



var privateKey = vapidKeys.privateKey;
fs.writeFile('privateKey/privateKey.txt', privateKey);
var publicKey = vapidKeys.publicKey;
fs.writeFile('publicKey/publicKey.txt', publicKey);

const options = {
  gcmAPIKey: apiKey,
  vapidDetails: {
    subject: 'mailto:sgwrryusk@gmail.com',
    publicKey: publicKey,
    privateKey: privateKey,
  }
};

http.createServer(function (req, res) {
  var body = '';

  req.on('data', function (chunk) {
    body += chunk;
    jsonObj = JSON.parse(body);
    
    if(req.url == '/registkey'){
      fs.writeFile('publicKey/publicKey.txt', encodeBase64URL(jsonObj.serverKey));
    }
    var privateKey = fs.readFileSync('privateKey/privateKey.txt', 'utf-8');
    var publicKey = fs.readFileSync('publicKey/publicKey.txt', 'utf-8');

    webpush.setGCMAPIKey(apiKey);
    webpush.setVapidDetails(
      'mailto:sgwrryusk@gmail.com',
      publicKey,
      privateKey
    );
    
    var options = {
      gcmAPIKey: apiKey,
      vapidDetails: {
        subject: 'mailto:sgwrryusk@gmail.com',
        publicKey: publicKey,
        privateKey: privateKey,
      },
      TTL: 86400
    };

    var pushSubscription = {
      endpoint : jsonObj.endpoint,
      keys: {
        auth : jsonObj.auth,
        p256dh : jsonObj.p256dh
      }  
    };
    const payload = JSON.stringify(webpush.encrypt(
      jsonObj.p256dh,
      jsonObj.auth,
      'push_test'
    ));

    
  webpush.sendNotification(pushSubscription, 'testest', options).then(function(result){
    console.log(result);
  }).catch(function(error){
    console.log(error);
  });

  });

  res.writeHead(200, {
    'Content-Type': 'text/json',
    'Access-Control-Allow-Origin': 'http://localhost:8080',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  res.end('publicKey');
}).listen(3000, '127.0.0.1');

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