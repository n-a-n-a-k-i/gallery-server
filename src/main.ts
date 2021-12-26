import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser';

(async () => {

    const port = Number(process.env.HTTP_PORT)
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: true,
            credentials: true,
            exposedHeaders: ['Content-Disposition']
        }
    })

    app.use(cookieParser())
    SwaggerModule.setup('/', app, SwaggerModule.createDocument(app, new DocumentBuilder()
        .setTitle('Gallery')
        .setDescription('Документация REST API')
        .setVersion(process.env.npm_package_version)
        .build()
    ))

    await app.listen(port, () => console.log(`REST API: http://localhost:${port}`))

})()
