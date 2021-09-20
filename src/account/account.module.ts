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
            secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'secret-for-access-token',
            signOptions: {
                expiresIn: `${eval(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) || 60 * 12}s`
            }
        })
    ]
})
export class AccountModule {
}
