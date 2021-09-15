import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

(async () => {

    const app = await NestFactory.create(AppModule)
    const PORT = Number(process.env.PORT) || 5000

    SwaggerModule.setup('/', app, SwaggerModule.createDocument(app, new DocumentBuilder()
        .setTitle('Gallery')
        .setDescription('Документация REST API')
        .setVersion(process.env.npm_package_version)
        .build()
    ))

    await app.listen(PORT, () => console.log(`http://localhost:${PORT}`))

})()