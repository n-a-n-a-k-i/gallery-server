import {ApiProperty} from "@nestjs/swagger";
import {PermissionModel} from "../model/permission.model";

export class PermissionDto {

    constructor(permissionModel: PermissionModel) {
        this.id = permissionModel.id
        this.value = permissionModel.value
        this.description = permissionModel.description
    }

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    readonly id: string

    @ApiProperty({description: 'Значение', example: 'USER_CREATE'})
    readonly value: string

    @ApiProperty({description: 'Описание', example: 'Создать пользователя'})
    readonly description: string

}