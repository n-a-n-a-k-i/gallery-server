import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {UserModel} from "./model/user.model";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        SequelizeModule.forFeature([UserModel])
    ],
    exports: [UserService]
})
export class UserModule {
}
