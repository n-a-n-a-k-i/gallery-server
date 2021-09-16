import { Injectable } from '@nestjs/common';
import {PermissionModel} from "./model/permission.model";
import {InjectModel} from "@nestjs/sequelize";

@Injectable()
export class PermissionService {

    constructor(
        @InjectModel(PermissionModel)
        private permissionModel: typeof PermissionModel
    ) {
    }

    async findAll(): Promise<PermissionModel[]> {
        return await this.permissionModel.findAll()
    }

}
