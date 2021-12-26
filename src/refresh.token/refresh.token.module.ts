import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {RefreshTokenController} from "./refresh.token.controller";
import {RefreshTokenService} from "./refresh.token.service";
import {RefreshTokenModel} from "./model/refresh.token.model";

@Module({
    controllers: [RefreshTokenController],
    providers: [RefreshTokenService],
    imports: [
        SequelizeModule.forFeature([RefreshTokenModel])
    ],
    exports: [RefreshTokenService]
})
export class RefreshTokenModule {}
