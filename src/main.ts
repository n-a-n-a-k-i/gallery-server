import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser';

(async () => {

    const app = await NestFactory.create(AppModule, {cors: true})
    const PORT = Number(process.env.HTTP_PORT)

    app.use(cookieParser())
    SwaggerModule.setup('/', app, SwaggerModule.createDocument(app, new DocumentBuilder()
        .setTitle('Gallery')
        .setDescription('Документация REST API')
        .setVersion(process.env.npm_package_version)
        .build()
    ))

    await app.listen(PORT, () => console.log(`REST API: http://localhost:${PORT}`))

})()