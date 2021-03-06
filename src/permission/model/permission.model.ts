import {BelongsToMany, Column, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {literal, TEXT, UUID} from "sequelize";
import {UserModel} from "../../user/model/user.model";
import {UserPermissionModel} from "../../user-permission/model/user-permission.model";
import {Permission} from "../enum/permission.enum";

@Table({comment: 'Разрешение', tableName: 'permission'})
export class PermissionModel extends Model<PermissionModel> {

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
        description: 'Значение',
        enum: Permission,
        example: Permission.USER_CREATE
    })
    @Column({
        comment: 'Значение',
        type: TEXT,
        allowNull: false,
        unique: true
    })
    value: Permission

    @ApiProperty({
        description: 'Описание',
        example: 'Создать пользователя'
    })
    @Column({
        comment: 'Описание',
        type: TEXT,
        allowNull: false
    })
    description: string

    @BelongsToMany(
        () => UserModel,
        () => UserPermissionModel
    )
    users: UserModel[]

}
