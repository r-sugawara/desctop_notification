var http = require('http');
var fs = require('fs');
var webpush = require('web-push');
var fetch = require('node-fetch');
var jsonObj = null;
const apiKey = 'AIzaSyBYlXCvvUrTCYR-F8POnPTinEXXgONcAnQ';

const vapidKeys = webpush.generateVAPIDKeys();

webpush.setGCMAPIKey(apiKey);

webpush.setVapidDetails(
  'mailto:sgwrryusk@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
var privateKey = fs.readFile('privateKey/privateKey.txt');
var publicKey = fs.readFile('publicKey/publicKey.txt');
console.log(privateKey);
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
    
    const options = {
      gcmAPIKey: apiKey,
      vapidDetails: {
        subject: 'mailto:sgwrryusk@gmail.com',
        publicKey: publicKey,
        privateKey: privateKey,
      }
    };
    const pushSubscription = {
      endpoint : jsonObj.endpoint,
      keys: {
        auth : jsonObj.auth,
        p256dh : jsonObj.p256dh
      }  
    };
    
    var encryptedData = JSON.stringify(webpush.encrypt(
      pushSubscription.keys.p256dh,
      pushSubscription.keys.auth,
      'push_test'
    ));

    const detail = webpush.sendNotification(pushSubscription, 'push_Test', options);
    console.log(detail);
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