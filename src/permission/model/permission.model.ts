import {BelongsToMany, Column, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {literal, TEXT, UUID} from "sequelize";
import {UserModel} from "../../user/model/user.model";
import {UserPermissionModel} from "../../account/model/user.permission.model";

@Table({comment: 'Разрешение', tableName: 'permission', createdAt: false, updatedAt: false})
export class PermissionModel extends Model<PermissionModel> {

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

    @ApiProperty({description: 'Значение', example: 'USER_CREATE'})
    @Column({comment: 'Значение', type: TEXT, allowNull: false, unique: true})
    value: string

    @ApiProperty({description: 'Описание', example: 'Создать пользователя'})
    @Column({comment: 'Описание', type: TEXT, allowNull: false})
    description: string

    @BelongsToMany(() => UserModel, () => UserPermissionModel)
    users: UserModel[]

}