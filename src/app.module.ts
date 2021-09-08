import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {UserModule} from './user/user.module';
import {ConfigModule} from "@nestjs/config";
import {UserModel} from "./user/model/user.model";
import {AccountModule} from './account/account.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: Number(process.env.POSTGRES_PORT) || 5432,
            username: process.env.POSTGRES_USER || 'gallery',
            password: process.env.POSTGRES_PASSWORD || 'gallery',
            database: process.env.POSTGRES_DB || 'gallery',
            models: [
                UserModel
            ],
            autoLoadModels: true
        }),
        UserModule,
        AccountModule
    ]
})
export class AppModule {
}