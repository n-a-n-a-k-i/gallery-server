import {Module, ValidationPipe} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {UserModule} from './user/user.module';
import {ConfigModule} from "@nestjs/config";
import {AccountModule} from './account/account.module';
import {APP_GUARD, APP_PIPE} from "@nestjs/core";
import {JwtAccessTokenGuard} from "./account/guard/jwt-access-token.guard";
import {PermissionGuard} from "./account/guard/permission.guard";
import {PermissionModule} from './permission/permission.module';
import {RefreshTokenModule} from "./refresh-token/refresh-token.module";
import { PhotoModule } from './photo/photo.module';
import {ScheduleModule} from "@nestjs/schedule";
import {CloudModule} from "./cloud/cloud.module";
import {UtilityModule} from "./utility/utility.module";
import {UserPermissionModule} from "./user-permission/user-permission.module";

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true
            })
        },
        {
            provide: APP_GUARD,
            useClass: JwtAccessTokenGuard
        },
        {
            provide: APP_GUARD,
            useClass: PermissionGuard
        }
    ],
    imports: [

        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),

        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadModels: true
        }),

        AccountModule,
        CloudModule,
        PermissionModule,
        PhotoModule,
        RefreshTokenModule,
        UserModule,
        UserPermissionModule,
        UtilityModule

    ]
})
export class AppModule {}
