import {Module} from '@nestjs/common';
import {AccountService} from './account.service';
import {UserModule} from "../user/user.module";
import {LocalStrategy} from "./strategy/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {AccountController} from "./account.controller";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategy/jwt.strategy";

@Module({
    controllers: [AccountController],
    providers: [AccountService, LocalStrategy, JwtStrategy],
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'gallery',
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES_IN || '12s'
            }
        })
    ]
})
export class AccountModule {
}
