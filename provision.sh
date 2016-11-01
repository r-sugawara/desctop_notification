LANG=ja_JP.utf-8

yum install -y epel-release
yum install -y --enablerepo=epel npm
systemctl stop firewalld

yum -y install nginx

cp /vagrant/*.conf /etc/nginx/conf.d/

chkconfig nginx on
service nginx start

npm init
npm config set prefix /usr/local
npm install -g web-push --save
npm install -g node-fetch --save
npm install -g express --save
npm install -g express-generator --save
npm install -g request --save