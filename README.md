# Gallery Server

REST API для Gallery

## Переменные среды

Переменные среды можно описать в файле `.env` в корне приложения:

```dotenv
HTTP_PORT=5000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=gallery
POSTGRES_PASSWORD=gallery
POSTGRES_DB=gallery

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_TOKEN_SECRET=secret-for-access-token
JWT_ACCESS_TOKEN_EXPIRATION_TIME=60*12
JWT_REFRESH_TOKEN_SECRET=secret-for-refresh-token
JWT_REFRESH_TOKEN_EXPIRATION_TIME=60*60*24*30
```

## База данных

```shell
docker run \
  --name gallery_db \
  --restart=always \
  -p 5555:5432 \
  -v gallery_db:/var/lib/postgresql/data \
  -e POSTGRES_DB=gallery \
  -e POSTGRES_USER=gallery \
  -e POSTGRES_PASSWORD=gallery \
  -d postgres
```