var vk = {
    data: {},
    appID: 4556386, // как веб сайт
    appPermissions: 8194,

    //инициализация
    init: function() {
        VK.init({apiId: 4556386});
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
                    url: 'userfind/?nuserId=' + data.id,
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

vk.init();
vk.access(function(usr) {
    console.log(usr);

    // VK.Api.call( //публикация уже загруженного изображения, фотографии
    //     'wall.post',
    //     {
    //         message: 'пост из моего приложения :)))',
    //         attachment: 'photo25962097_340611618'
    //     },
    //     function(r) {
    //         if(r.response) {
    //             console.log(r.response);
    //         }
    //     }
    // );
    VK.Api.call(
        'friends.get',
        {},
        function(r) {
            console.log(r)
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
    )
});
// VK.UI.button('login_button');

alert(vk.data.user);
// vk.getUserInfo(vk.data.user.id);
