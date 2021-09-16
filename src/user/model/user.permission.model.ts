import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {TEXT, UUID} from "sequelize";
import {UserModel} from "./user.model";
import {PermissionModel} from "./permission.model";

@Table({comment: 'Пользователь - Разрешение', tableName: 'user_permission', createdAt: false, updatedAt: false})
export class UserPermissionModel extends Model<UserPermissionModel> {

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    @ForeignKey(() => UserModel)
    @Column({comment: 'Пользователь', type: UUID, allowNull: false})
    user: string

    @ApiProperty({description: 'Разрешение', example: 'USER_CREATE'})
    @ForeignKey(() => PermissionModel)
    @Column({comment: 'Разрешение', type: TEXT, allowNull: false})
    permission: string

}