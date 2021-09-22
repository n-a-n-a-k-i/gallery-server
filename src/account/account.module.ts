import {Module} from '@nestjs/common';
import {AccountService} from './account.service';
import {UserModule} from "../user/user.module";
import {LocalStrategy} from "./strategy/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {AccountController} from "./account.controller";
import {JwtAccessTokenStrategy} from "./strategy/jwt.access.token.strategy";
import {JwtRefreshTokenStrategy} from "./strategy/jwt.refresh.token.strategy";
import {RefreshTokenModule} from "../refresh.token/refresh.token.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [AccountController],
    providers: [
        AccountService,
        LocalStrategy,
        JwtAccessTokenStrategy,
        JwtRefreshTokenStrategy
    ],
    imports: [
        JwtModule.register({}),
        PassportModule,
        UserModule,
        RefreshTokenModule
    ]
})
export class AccountModule {
}
