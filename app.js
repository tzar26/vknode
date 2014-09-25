// var app = require('express').createServer();
var express = require("express");
var app = express();
var request = require('request');
var APP_ID = '4556386',
    SECRET = 'ET1IPpkIFSqawsZSqEIG',
    REDIRECT_URI = 'http://whiteknez.ru';

app.use(express.static(__dirname + '/static'));
app.use(express.cookieParser());

app.get('/', function(req, res){
    var uri = 'https://api.vk.com/oauth/token?client_id=' + APP_ID + '&code=' + req.query.code + '&client_secret=' + SECRET + '&redirect_uri=' + REDIRECT_URI;
    if(req.query.code){
        console.log(req.cookies.access_token)
        if(!req.cookies.access_token)
            request.post({url: uri}, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    // res.cookie('access_token', info.access_token);
                    res.cookie('access_token', info.access_token, { expires: new Date(Date.now() + info.expires_in)});
                    send_menu(req, res, info.access_token);
                } else {
                    console.log(response.body);
                    res.end(response.body);
                }
            })
        else
            send_menu(req, res);
    } else {
        res.end('<script  src="./script.js"></script><a href="#" onclick="vkauth();" >Вход через ВКонтакте</a>');
        return;
    }
});

send_menu = function(req, res, token) {
    if(!token)
        token = req.cookies.access_token;
    url_self_info = 'https://api.vk.com/method/users.get?fields=photo_100,city,schools&v=5.8&access_token=' + token;
    url_friends_info = 'https://api.vk.com/method/friends.get?access_token=' + token;
    url_public_test_info = 'https://api.vk.com/method/wall.post?message=test&access_token=' + token;
    res.send('<a href="' + url_self_info + '" target="_blank">Получить информацию</a><br /><a href="' + url_friends_info + '" target="_blank">Получить друзей</a><br /><a href="' + url_public_test_info + '" target="_blank">Опубликовать тестовое сообщение</a>');
}

app.listen(80);