// var app = require('express').createServer();
var express = require("express");
var app = express();
var request = require('request');
var APP_ID = '4556386',
    SECRET = 'ET1IPpkIFSqawsZSqEIG',
    REDIRECT_URI = 'http://whiteknez.ru';

app.use(express.static(__dirname + '/static'));
app.use(express.cookieParser());

app.get('/', function(req, res) {
    var swig = require("swig");
    var template = swig.compileFile("/var/www/vkapi/vk_node/templates/home.html");
    var output = template({
            pagename: 'awesome people',
            authors: ['Paul', 'Jim', 'Jane']
        });
    res.send(output);
});


app.listen(80);