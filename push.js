self.addEventListener('push', function(evt) {
  var data = evt.data.json();
  //var message = decrypt(data);
  evt.waitUntil(
    self.registration.showNotification(
      '通知が来たよ!',
      {
        icon: '/image/mikan.jpg',
        body: data.toString()
      }
    )
  );
}, false);

self.addEventListener('notificationclick', function(evt) {
  evt.notification.close();

  evt.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(evt) {
      var p = location.pathname.split('/');
      p.pop();
      p = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port : '') + p.join('/') + '/';
      for(var i = 0 ; i < evt.length ; i++) {
        var c = evt[i];
        if(((c.url == p) || (c.url == p + 'index.html')) && ('focus' in c))
          return c.focus();
      }
      if(clients.openWindow)
        return clients.openWindow('./');
    })
  );
}, false);

function decrypt(data){

  crypto.subtle.deriveKey( // 鍵共有による共有鍵生成
    { name: 'ECDH', namedCurve: 'P-256', public: serverKey },
    uaKey,
    { name: 'AES-GCM', length: 128 },
    false,
    ['encrypt', 'decrypt']
  ).then(key => {          // AES-GCMによる復号
    return crypto.subtle.decrypt(
      { name: 'AES-GCM', data: data.salt, tagLength: 128 },
      key,
      data.cypherText.data
    );
  }).then(data => {
    console.log(data);
    // このdataが暗号化のサンプルコードのinputと同じものになるはず
  });
}