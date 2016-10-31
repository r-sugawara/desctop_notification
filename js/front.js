let serverKey = null;
let uaKey = null;
window.addEventListener('load', function() {
    document.getElementById('register').addEventListener('click', register, false);
    document.getElementById('push').addEventListener('click', setPush , false);
    fetch('/serverKey');
    navigator.serviceWorker.ready.then(checkPush);
}, false);

//サービスワーカーに処理を登録
function register() {
    navigator.serviceWorker.register('push.js').then(checkNotification);
}

//push通知が有効か確認
function checkNotification() {
    Notification.requestPermission(function(permission) {
        if(permission !== 'denied'){
            document.getElementById('push').disabled = false;
        }else{
            alert('プッシュ通知を有効にできません。ブラウザの設定を確認して下さい。');
        }
    });
}
var subscription = null;

function getPublicKey(sub){
    var key = btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))).replace(/\+/g, '-').replace(/\//g, '_');
    uaKey = key;
    return key;
};


function checkPush(sw) {
    sw.pushManager.getSubscription().then(setSubscription, resetSubscription);
}

function setSubscription(s) {
    if(!s){
        resetSubscription();
    }else {
        document.getElementById('register').disabled = true;
        subscription = s;
        var p = document.getElementById('push');
        p.textContent = 'プッシュ通知を解除する';
        p.disabled = false;
        registerNotification(s);
    }
}

function resetSubscription() {
    document.getElementById('register').disabled = true;
    subscription = null;
    var p = document.getElementById('push');
    p.textContent = 'プッシュ通知を有効にする';
    p.disabled = false;
}

function setPush() {
    if(!subscription) {
        if(Notification.permission == 'denied') {
            alert('プッシュ通知を有効にできません。ブラウザの設定を確認して下さい。');
            return;
        }
        navigator.serviceWorker.ready.then(subscribe);
    }else{
        navigator.serviceWorker.ready.then(unsubscribe);
    }
}

function subscribe(sw) {
    sw.pushManager.subscribe({
        userVisibleOnly: true,
        //applicationServerKey: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))).replace(/\+/g, '-').replace(/\//g, '_')
    }).then(setSubscription);
}

function unsubscribe() {
    if(subscription) {
        // 自分のWebアプリサーバ等にプッシュ通知の解除を通知する処理をここに実装
        subscription.unsubscribe();
        }
    resetSubscription();
}

function registerNotification(s) {
    var endpoint = s.endpoint;
    // Chrome 43以前への対処
    if(('subscriptionId' in s) && !s.endpoint.match(s.subscriptionId))
        endpoint += '/' + s.subscriptionId;
        // 自分のWebアプリサーバ等にプッシュ通知を登録する処理をここに実装
        // endpointにプッシュサービスのエンドポイントのURLが格納される
}

//サーバー側のpublickey保存
function setServerKey(key) {
  serverKey = decodeBase64URL(key);
  navigator.serviceWorker.ready.then(serviceWorkerReady);
}

navigator.serviceWorker.ready.then(function(sw) {
  sw.pushManager.getSubscription().then(function(sub){
    fetch('http://localhost:8000', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data; charset=UTF-8' },
      body: JSON.stringify({
        endpoint: sub.endpoint,
        p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))).replace(/\+/g, '-').replace(/\//g, '_'),
        auth: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))).replace(/\+/g, '-').replace(/\//g, '_')
      })
    });
  });
});