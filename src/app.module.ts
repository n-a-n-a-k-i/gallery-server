import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {UserModule} from './user/user.module';
import {ConfigModule} from "@nestjs/config";
import {UserModel} from "./user/model/user.model";
import {AccountModule} from './account/account.module';
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./account/guard/jwt.auth.guard";
import {PermissionModel} from "./permission/model/permission.model";
import {UserPermissionModel} from "./account/model/user.permission.model";
import {PermissionGuard} from "./account/guard/permission.guard";
import {PermissionModule} from './permission/permission.module';
import {TokenModule} from './token/token.module';
import {TokenModel} from "./token/model/token.model";

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        },
        {
            provide: APP_GUARD,
            useClass: PermissionGuard
        }
    ],
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
                UserModel,
                PermissionModel,
                UserPermissionModel,
                TokenModel
            ],
            autoLoadModels: true
        }),
        AccountModule,
        UserModule,
        PermissionModule,
        TokenModule
    ]
})
export class AppModule {
}