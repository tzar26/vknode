var APP_ID = '4556386',
    SECRET = 'ET1IPpkIFSqawsZSqEIG',
    REDIRECT_URI = 'http://whiteknez.ru';

function vkauth(){
    /** Перенаправляем на страницу авторизации ВКонтакте */
    location.href = 'http://api.vk.com/oauth/authorize?client_id=' + APP_ID + '&redirect_uri=' + REDIRECT_URI + '&display=page&scope=wall';
}