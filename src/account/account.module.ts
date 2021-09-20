import {Module} from '@nestjs/common';
import {AccountService} from './account.service';
import {UserModule} from "../user/user.module";
import {LocalStrategy} from "./strategy/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {AccountController} from "./account.controller";
import {JwtStrategy} from "./strategy/jwt.strategy";
import {TokenModule} from "../token/token.module";

@Module({
    controllers: [AccountController],
    providers: [AccountService, LocalStrategy, JwtStrategy],
    imports: [
        UserModule,
        PassportModule,
        TokenModule
    ]
})
export class AccountModule {
}
