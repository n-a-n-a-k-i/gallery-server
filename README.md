# Gallery Server

REST API для Gallery

## Переменные среды

Переменные среды описать в файле `.env` в корне приложения:

```dotenv
HTTP_PORT=5001
HTTP_COOKIE_SECURE=false

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=gallery
POSTGRES_PASSWORD=gallery
POSTGRES_DB=gallery

BCRYPT_PASSWORD_SALT_ROUNDS=10
CRYPTO_REFRESH_TOKEN_ALGORITHM=sha512

JWT_ACCESS_TOKEN_SECRET=secret-for-access-token
JWT_ACCESS_TOKEN_EXPIRES_IN=1000*60*12
JWT_REFRESH_TOKEN_SECRET=secret-for-refresh-token
JWT_REFRESH_TOKEN_EXPIRES_IN=1000*60*60*24*365

PHOTO_THUMBNAIL_WIDTH=256
PHOTO_THUMBNAIL_HEIGHT=256
PHOTO_THUMBNAIL_FIT=cover
PHOTO_PREVIEW_WIDTH=1024
PHOTO_PREVIEW_HEIGHT=1024
PHOTO_PREVIEW_FIT=inside

NEXTCLOUD_OWNER=00000000-0000-0000-0000-000000000000
NEXTCLOUD_WEBDAV=https://cloud.example.org/remote.php/dav
NEXTCLOUD_PATH=/var/lib/docker/volumes/nextcloud_app/_data/data
NEXTCLOUD_USER_PATH={username}/files/{path}
NEXTCLOUD_USER_PATH_SYNC={year}/{month}
NEXTCLOUD_FILE_NAME="{year}-{month}-{day} {hours}-{minutes}-{seconds} {id}"
NEXTCLOUD_FILE_EXT=jpg
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

Переменные:

```ts
export enum DateColumn {
    date = 'date',
    atime = 'atime',
    mtime = 'mtime',
    ctime = 'ctime',
    birthtime = 'birthtime',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt'
}

class Variables {
    username: string = 'user'
    password: string = '12345678'
    server: string = 'http://localhost:5001'
    photoId: string = '00000000-0000-0000-0000-000000000000'
    dateColumn: DateColumn = DateColumn.mtime
    accessToken: string = 'xxx.yyy.zzz'
}
```

Предзапросный скрипт для `{{server}}/account`:

```js
const server = pm.collectionVariables.get('server')

pm.sendRequest(`${server}/account/sign-out`, (error, response) => {

    if (error) console.error(error)

    pm.sendRequest({
        url: `${server}/account/sign-in`,
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                username: pm.collectionVariables.get('username'),
                password: pm.collectionVariables.get('password')
            })
        }
    }, (error, response) => {
        console.log(response)

        if (error) console.error(error)
        if (response.code === 200) pm.collectionVariables.set('accessToken', response.json().accessToken)

    })

})
```

Предзапросный скрипт для `{{server}}/account/sign-out`:

```js
pm.collectionVariables.unset('accessToken')
```