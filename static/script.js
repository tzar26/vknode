var vk = {
    data: {},
    appID: 4556386, // как веб сайт
    appPermissions: 8194,

    //инициализация
    init: function() {
        VK.init({ apiId: vk.appID });
    },

    //метод входа
    login: function(callback) {
        function authInfo(response){
            if(response.session){ // Авторизация успешна
                console.log(response)
                vk.data.user = response.session.user;
                callback(vk.data.user);
            } else {
                alert("Авторизоваться не удалось!");
            }
        }

        VK.Auth.login(authInfo, vk.appPermissions);
    },

    //метод проверки доступа
    access: function(callback) {
        VK.Auth.getLoginStatus(function (response) {
            if(response.session){ // Пользователь авторизован
                callback(vk.data.user);
            } else { // Пользователь не авторизован
                vk.login(callback);
            }
        })
    },

    getUserInfo: function(userId) {
        if(!userId)
            return;

        VK.Api.call(
            'users.get',
            {
                user_ids: userId,
                fields: 'sex,bdate,city,photo_100,education,schools',
                v: 5.8
            },
            function(r) {
                var data = r.response;
                $.ajax({
                    type: 'POST',
                    url: 'userfind/?userId=' + data.id,
                    // url: 'useradd/?name=' + data.name + '&id=' + data.id + '&avatar=' + data.avatar,
                    success: function(data) {
                        console.log(data);
                    },
                    error: function(err) {
                        console.error(err);
                    }
                });
            });
    },

    logout: function() {
        VK.Auth.logout();
        this.data.user={};
        alert('вы вышли');
    },
}

// vk.init();
// vk.access(function(usr) {
//     console.log(usr);

//     // VK.Api.call( //публикация уже загруженного изображения, фотографии
//     //     'wall.post',
//     //     {
//     //         message: 'пост из моего приложения :)))',
//     //         attachment: 'photo25962097_340611618'
//     //     },
//     //     function(r) {
//     //         if(r.response) {
//     //             console.log(r.response);
//     //         }
//     //     }
//     // );
//     VK.Api.call(
//         'friends.get',
//         {},
//         function(r) {
//             console.log(r)
//             if(r.response) {
//                 var friends = r.response, friends_list_line = '';
//                 for(var f in friends) {
//                     friends_list_line = (friends_list_line != '') ? friends_list_line + ',' + friends[f] : friends[f];
//                 };
//                 VK.Api.call(
//                     'users.get',
//                     {
//                         user_ids: friends_list_line,
//                         fields: 'sex,bdate,city,photo_100,education,schools',
//                         v: 5.8
//                     },
//                     function(r) {
//                         if(r.response) {
//                             alert(r.response[0].first_name)
//                         }
//                     }
//                 )
//             }
//         }
//     )
// });
// VK.UI.button('login_button');

// alert(vk.data.user);
// vk.getUserInfo(vk.data.user.id);
var url_parser={
        get_args: function (s) {
            var tmp=new Array();
            s=(s.toString()).split('&');
            for (var i in s) {
                i=s[i].split("=");
                tmp[(i[0])]=i[1];
            }
            return tmp;
        },
        get_args_cookie: function (s) {
            var tmp=new Array();
            s=(s.toString()).split('; ');
            for (var i in s) {
                i=s[i].split("=");
                tmp[(i[0])]=i[1];
            }
            return tmp;     
        }
};

var plugin_vk = {
    wwwref: false,
    plugin_perms: "friends,wall,photos,wall,offline,notes",
    appID: 4556386,

    auth: function (force) {
        var ref = window.open('http://apache.org', '_blank', 'location=yes');
        var myCallback = function(event) { alert(event.url); }
        ref.addEventListener('loadstart', myCallback);
        ref.removeEventListener('loadstart', myCallback);
        
        // return false;
        // if (!window.localStorage.getItem("plugin_vk_token") || force || window.localStorage.getItem("plugin_vk_perms")!=plugin_vk.plugin_perms) {
        //     var authURL="https://oauth.vk.com/authorize?client_id=" + plugin_vk.appID + "&scope="+this.plugin_perms+"&redirect_uri=http://oauth.vk.com/blank.html&display=touch&response_type=token";
        //     this.wwwref = window.open(encodeURI(authURL), '_blank', 'location=no');
        //     console.log(1)
        //     this.wwwref.addEventListener('loadstop', function(){alert('loadstop')});
        //     this.wwwref.addEventListener('onload', function(){alert('onload')});
        //     // this.wwwref.addEventListener('loadstop', this.auth_event_url);
        // }
    },
    auth_event_url: function (event) {
        alert(1)
        var tmp=(event.url).split("#");
        if (tmp[0]=='https://oauth.vk.com/blank.html' || tmp[0]=='http://oauth.vk.com/blank.html') {
            plugin_vk.wwwref.close();
            var tmp=url_parser.get_args(tmp[1]);
            window.localStorage.setItem("plugin_vk_token", tmp['access_token']);
            window.localStorage.setItem("plugin_vk_user_id", tmp['user_id']);
            window.localStorage.setItem("plugin_fb_exp", tmp['expires_in']);
            window.localStorage.setItem("plugin_vk_perms", plugin_vk.plugin_perms);
            alert(tmp.access_token)
        }
    }
};
plugin_vk.auth();