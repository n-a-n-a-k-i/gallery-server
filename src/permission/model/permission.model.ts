import {BelongsToMany, Column, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {TEXT} from "sequelize";
import {UserModel} from "../../user/model/user.model";
import {UserPermissionModel} from "../../account/model/user.permission.model";

@Table({comment: 'Разрешение', tableName: 'permission', createdAt: false, updatedAt: false})
export class PermissionModel extends Model<PermissionModel> {

    @ApiProperty({description: 'Идентификатор', example: 'USER_CREATE'})
    @Column({comment: 'Идентификатор', type: TEXT, allowNull: false, unique: true, primaryKey: true})
    id: string

    @ApiProperty({description: 'Описание', example: 'Создать пользователя'})
    @Column({comment: 'Описание', type: TEXT, allowNull: false})
    description: string

    @BelongsToMany(() => UserModel, () => UserPermissionModel)
    users: UserModel[]

}