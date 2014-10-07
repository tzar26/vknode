var express = require("express");
var app = express();
var request = require('request');

app.use(express.static(__dirname + '/static'));
app.use(express.cookieParser());

app.get('/', function(req, res, next) {
    var swig = require("swig");
    var template = swig.compileFile("/var/www/vkapi/vk_node/templates/home.html");
    var output = template({
            // pagename: 'awesome people',
            // authors: ['Paul', 'Jim', 'Jane']
        });
    res.send(output);
});


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var userSchema = mongoose.Schema({
    name: String,
    vkid: String,
    avatar: String,
});
var User = mongoose.model('User', userSchema);

var AddUser = function(req, callback) {
    var user = new User({
        name: req.query.name,
        vkid: req.query.vkid,
        avatar: req.query.avatar,
    });
    user.save(function(err, usr) {
        if(err) {
            callback({ error: 'fuck' });
        };
        callback(usr);
    });
};
app.post('/register/', function(req, res, next) {
    AddUser(req, function(user) {
        res.json(user);
    });
});

var GetUser = function(req, callback) {
    User.find(
        { vkid: req.query.userId },
        function(err, r) {
            if(err) 
                callback({})
            else
                callback(r);
        }
    )
}
app.get('/userfind/', function(req, res, next) {
    GetUser(req, function(user) {
        if(!user) {
            res.json({});
            return;
        }
        user=user[0]
        if(user) {
            res.json({
                name: user.name,
                vkid: user.vkid,
                avatar: user.avatar,
            });
        } else {
            res.json({error: 'no user'})
        }
    })
});

app.listen(80);