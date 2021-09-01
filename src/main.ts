import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {

    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule)

    SwaggerModule.setup('/', app, SwaggerModule.createDocument(app,
        new DocumentBuilder()
            .setTitle('Gallery')
            .setDescription('Документация REST API')
            .setVersion(process.env.npm_package_version)
            // .addTag('Nanaki')
            .build()
    ))

    await app.listen(PORT, () => console.log(`http://localhost:${PORT}`))

}

bootstrap()