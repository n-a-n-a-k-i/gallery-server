# Gallery Server

REST API для Gallery

## Переменные среды

Переменные среды описать в файле `.env` в корне приложения:

```dotenv
HTTP_PORT=5000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=gallery
POSTGRES_PASSWORD=gallery
POSTGRES_DB=gallery

BCRYPT_PASSWORD_SALT_ROUNDS=10
CRYPTO_REFRESH_TOKEN_ALGORITHM=sha512

JWT_ACCESS_TOKEN_SECRET=secret-for-access-token
JWT_ACCESS_TOKEN_EXPIRATION_TIME=60*12
JWT_REFRESH_TOKEN_SECRET=secret-for-refresh-token
JWT_REFRESH_TOKEN_EXPIRATION_TIME=60*60*24*30

PHOTO_THUMBNAIL_WIDTH=256
PHOTO_THUMBNAIL_HEIGHT=256
PHOTO_THUMBNAIL_FIT=cover
PHOTO_PREVIEW_WIDTH=1024
PHOTO_PREVIEW_HEIGHT=1024
PHOTO_PREVIEW_FIT=inside

NEXTCLOUD_DIR=/var/lib/docker/volumes/nextcloud_app/_data/data
NEXTCLOUD_WEBDAV=https://cloud.example.org/remote.php/dav
```

## Запуск

Установить `pm2`:

```shell
pm2 start dist/main.js --name gallery-server
```

## База данных

Пример в docker:

```shell
docker run --name gallery_database --restart=always -p 55432:5432 -v gallery_database:/var/lib/postgresql/data -e POSTGRES_DB=gallery -e POSTGRES_USER=gallery -e POSTGRES_PASSWORD=gallery -d postgres
```

## Postman

Предзапросный скрипт:

```js
(() => {

    const user = {username: 'gallery', password: 'gallery'}

    /**
     * Удаление переменной с токеном доступа
     */

    const accessToken = pm.collectionVariables.get('accessToken')

    if (accessToken) {

        pm.collectionVariables.unset('accessToken')
        console.log(`Удалён токен доступа: ${accessToken}`)

    }

    /**
     * Выход
     */

    pm.sendRequest('http://localhost:5000/account/sign-out', (error, response) => {

        if (error) console.log(error)
        if (response.code !== 200) console.log(`${response.code}: ${response.json().message}`)

        /**
         * Вход
         */

        pm.sendRequest({
            url: 'http://localhost:5000/account/sign-in',
            method: 'POST',
            header: {'Content-Type': 'application/json'},
            body: {mode: 'raw', raw: JSON.stringify(user)}
        }, (error, response) => {

            if (error) console.log(error)
            if (response.code !== 200) console.log(`${response.code}: ${response.json().message}`)

            /**
             * Обновление токенов
             */

            pm.sendRequest('http://localhost:5000/account/refresh', (error, response) => {

                if (error) console.log(error)
                if (response.code !== 200) console.log(`${response.code}: ${response.json().message}`)

                /**
                 * Установка переменной с токеном доступа
                 */

                pm.collectionVariables.set('accessToken', response.json().accessToken)

            })

        })

    })

})()
```