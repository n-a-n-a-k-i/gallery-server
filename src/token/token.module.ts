import {Module} from '@nestjs/common';
import {TokenController} from './token.controller';
import {TokenService} from './token.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {TokenModel} from "./model/token.model";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [TokenController],
    providers: [TokenService],
    imports: [
        SequelizeModule.forFeature([TokenModel]),
        JwtModule.register({})
    ],
    exports: [TokenService]
})
export class TokenModule {
}
