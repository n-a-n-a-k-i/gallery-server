import {ApiProperty} from "@nestjs/swagger";
import {PermissionModel} from "../model/permission.model";
import {Permission} from "../enum/permission.enum";
import {IsDate} from "class-validator";

export class PermissionDto {

    constructor(permissionModel: PermissionModel) {
        this.id = permissionModel.id
        this.value = permissionModel.value
        this.description = permissionModel.description
        this.createdAt = permissionModel.createdAt
        this.updatedAt = permissionModel.updatedAt
    }

    @ApiProperty({
        description: 'Идентификатор',
        format: 'uuid'
    })
    readonly id: string

    @ApiProperty({
        description: 'Значение',
        enum: Permission,
        example: Permission.USER_CREATE
    })
    readonly value: Permission

    @ApiProperty({
        description: 'Описание',
        example: 'Создать пользователя'
    })
    readonly description: string

    @ApiProperty({
        description: 'Дата создания',
        format: 'date-time'
    })
    @IsDate()
    readonly createdAt: Date

    @ApiProperty({
        description: 'Дата изменения',
        format: 'date-time'
    })
    @IsDate()
    readonly updatedAt: Date

}
