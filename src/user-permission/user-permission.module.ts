import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {UserPermissionModel} from "./model/user-permission.model";

@Module({
    imports: [
        SequelizeModule.forFeature([
            UserPermissionModel
        ])
    ]
})
export class UserPermissionModule {}
