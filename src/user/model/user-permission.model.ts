import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {literal, UUID} from "sequelize";
import {UserModel} from "./user.model";
import {PermissionModel} from "../../permission/model/permission.model";

@Table({comment: 'Пользователь - Разрешение', tableName: 'user_permission'})
export class UserPermissionModel extends Model<UserPermissionModel> {

    @ApiProperty({
        description: 'Идентификатор',
        format: 'uuid'
    })
    @Column({
        comment: 'Идентификатор',
        type: UUID,
        defaultValue: literal('gen_random_uuid()'),
        allowNull: false,
        unique: true,
        primaryKey: true
    })
    id: string

    @ApiProperty({
        description: 'Пользователь',
        format: 'uuid'
    })
    @ForeignKey(() => UserModel)
    @Column({
        comment: 'Пользователь',
        type: UUID,
        allowNull: false
    })
    user: string

    @ApiProperty({
        description: 'Разрешение',
        format: 'uuid'
    })
    @ForeignKey(() => PermissionModel)
    @Column({
        comment: 'Разрешение',
        type: UUID,
        allowNull: false
    })
    permission: string

}
