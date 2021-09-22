import {Module} from '@nestjs/common';
import {AccountService} from './account.service';
import {UserModule} from "../user/user.module";
import {LocalStrategy} from "./strategy/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {AccountController} from "./account.controller";
import {JwtAccessTokenStrategy} from "./strategy/jwt.access.token.strategy";
import {TokenModule} from "../token/token.module";
import {JwtRefreshTokenStrategy} from "./strategy/jwt.refresh.token.strategy";

@Module({
    controllers: [AccountController],
    providers: [
        AccountService,
        LocalStrategy,
        JwtAccessTokenStrategy,
        JwtRefreshTokenStrategy
    ],
    imports: [
        UserModule,
        PassportModule,
        TokenModule
    ]
})
export class AccountModule {
}
