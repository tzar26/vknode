var wall_access_code = 8192;
var vk = {
    data: {},
    appID: 4556386, // как веб сайт
    appPermissions: VK.access.FRIENDS + wall_access_code, //8194,
    //инициализация
    init: function() {
        //TODO нужна инициализации данных о пользователе из хранилища устройства
        VK.init({apiId: 4556386});
    },

    //метод входа
    login: function(callback) {
        function authInfo(response){
            if(response.session){ // Авторизация успешна
                vk.alert('Авторизация успешна')
                vk.data.user = response.session.user;
                callback(vk.data.user);
            } else {
                vk.alert("Авторизоваться не удалось!");
            }
        }

        VK.Auth.login(authInfo, vk.appPermissions);
    },

    alert: function(msg) {
        alert(msg);
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

    registerUser: function(data) {
        $.ajax({
            url: 'register/?name=' + data.first_name + '&vkid=' + data.id + '&avatar=' + data.photo_100,
            type: 'POST',
            success: function(data) {
                vk.alert('register succeess')
            },
            error: function(err) {
                console.error(err);
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
                var data = r.response[0];
                $.ajax({
                    url: 'userfind/?userId=' + userId,
                    type: 'GET',
                    success: function(r) {
                        if(!r.vkid)
                            vk.registerUser(data);
                        vk.data.user = data;
                    },
                    error: function(err) {
                        console.error(err);
                    }
                });
            });
    },

    getFriends: function() {
        VK.Api.call(
            'friends.get',
            {},
            function(r) {
                if(r.response) {
                    var friends = r.response, friends_list_line = '';
                    for(var f in friends) {
                        friends_list_line = (friends_list_line != '') ? friends_list_line + ',' + friends[f] : friends[f];
                    };
                    VK.Api.call(
                        'users.get',
                        {
                            user_ids: friends_list_line,
                            fields: 'sex,bdate,city,photo_100,education,schools',
                            v: 5.8
                        },
                        function(r) {
                            if(r.response) {
                                alert(r.response[0].first_name)
                            }
                        }
                    )
                }
            }
        );
    },

    publiceMessageOnWall: function() {
        VK.Api.call( //публикация уже загруженного изображения, фотографии
            'wall.post',
            {
                message: 'пост из моего приложения :)))',
                attachment: 'photo25962097_340611618'
            },
            function(r) {
                if(r.response) {
                    console.log(r.response);
                }
            }
        );
    },

    logout: function() {
        VK.Auth.logout();
        this.data.user={};
        alert('вы вышли');
    },
}

vk.init();
vk.access(function(usr) {
    if(!usr) usr = { id: "25962097" }
    vk.getUserInfo(usr.id);
});
// VK.UI.button('login_button');

getUser = function() {
    console.log(vk.data.user);
}
