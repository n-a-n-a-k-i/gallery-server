import { Injectable } from '@nestjs/common';
import {PermissionModel} from "./model/permission.model";
import {InjectModel} from "@nestjs/sequelize";

@Injectable()
export class PermissionService {

    constructor(
        @InjectModel(PermissionModel)
        private permissionModel: typeof PermissionModel
    ) {}

    /**
     * Поиск разрешений
     */
    async find(): Promise<PermissionModel[]> {
        return await this.permissionModel.findAll()
    }

}
