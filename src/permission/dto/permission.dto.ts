import {ApiProperty} from "@nestjs/swagger";
import {PermissionModel} from "../model/permission.model";

export class PermissionDto {

    constructor(permissionModel: PermissionModel) {
        this.id = permissionModel.id
        this.description = permissionModel.description
    }

    @ApiProperty({description: 'Идентификатор', example: 'USER_CREATE'})
    readonly id: string

    @ApiProperty({description: 'Описание', example: 'Создать пользователя'})
    readonly description: string

}