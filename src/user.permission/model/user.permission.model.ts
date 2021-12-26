import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {literal, UUID} from "sequelize";
import {UserModel} from "../../user/model/user.model";
import {PermissionModel} from "../../permission/model/permission.model";

@Table({comment: 'Пользователь - Разрешение', tableName: 'user_permission'})
export class UserPermissionModel extends Model<UserPermissionModel> {

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    @Column({
        comment: 'Идентификатор',
        type: UUID,
        defaultValue: literal('gen_random_uuid()'),
        allowNull: false,
        unique: true,
        primaryKey: true
    })
    id: string

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    @ForeignKey(() => UserModel)
    @Column({comment: 'Пользователь', type: UUID, allowNull: false})
    user: string

    @ApiProperty({description: 'Разрешение', example: '00000000-0000-0000-0000-000000000000'})
    @ForeignKey(() => PermissionModel)
    @Column({comment: 'Разрешение', type: UUID, allowNull: false})
    permission: string

}