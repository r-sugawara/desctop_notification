var http = require('http');
//var express = require('express');
const webpush = require('web-push');
var fetch = require('node-fetch');
var request = require('request');

const apiKey = 'AIzaSyBYlXCvvUrTCYR-F8POnPTinEXXgONcAnQ';

const vapidKeys = webpush.generateVAPIDKeys();

webpush.setGCMAPIKey(apiKey);

webpush.setVapidDetails(
  'mailto:sgwrryusk@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const options = {
  gcmAPIKey: apiKey,
  vapidDetails: {
    subject: 'mailto:sgwrryusk@gmail.com',
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
  }
};

http.createServer(function (req, res) {
  var body = '';

  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    var jsonObj = JSON.parse(body);
    console.log(jsonObj);
  });
  
  const pushSubscription = {
    endpoint : 'https://android.googleapis.com/gcm/send/c5caDHlgI28:APA91bECC0M1RUZMDlefE4WWfvoNjB4unVpKtCzS1TIp8JCEsf9g30LjM9vWg-wIa60dpXogybJUyfsMPL-qIuMxClBTMjFWacyhtsaDcRFOR5tPavnOBhUNtn5-QSOoeanc0dy8WqWX',//body.endpoint,
    keys: {
      auth : 'W3_S6mTzJuYRSxNN1lSuRA==',//body.auth,
      p256dh : 'BLio321ENURINe4OCGtmpUedL10zmTJCismaWzSI1TyFhECMlaLAbptzeOFW4g34IYGM51iQSJYfCGPzp1IGZnM='//body.p256dh
    }  
  };
  var encryptedData = JSON.stringify(webpush.encrypt(
    pushSubscription.keys.p256dh,
    pushSubscription.keys.auth,
    'push_test'
  ));

  const detail = webpush.generateRequestDetails(pushSubscription, encryptedData, options);
  
  fetch(pushSubscription.endpoint, detail);
  
  res.writeHead(200, {
    'Content-Type': 'text/json',
    'Access-Control-Allow-Origin': 'http://localhost:8080',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  res.end(vapidKeys.publicKey);
}).listen(3000, '127.0.0.1');
