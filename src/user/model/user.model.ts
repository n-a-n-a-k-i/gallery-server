import {Column, Model, Table} from "sequelize-typescript";
import {BOOLEAN, literal, TEXT, UUID} from "sequelize";
import {ApiProperty} from "@nestjs/swagger";

interface UserModelCreation {
    username: string
    password: string
    email: string
}

@Table({tableName: 'user'})
export class UserModel extends Model<UserModel, UserModelCreation> {

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    @Column({comment: 'Идентификатор', type: UUID, defaultValue: literal('gen_random_uuid()'), allowNull: false, unique: true, primaryKey: true})
    id: string

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    @Column({comment: 'Имя пользователя', type: TEXT, allowNull: false, unique: true})
    username: string

    @ApiProperty({description: 'Пароль', example: '12345678'})
    @Column({comment: 'Пароль', type: TEXT, allowNull: false})
    password: string

    @ApiProperty({description: 'Электронная почта', example: 'user@gallery.nanaki'})
    @Column({comment: 'Электронная почта', type: TEXT, allowNull: false, unique: true})
    email: string

    @ApiProperty({description: 'Активирован', example: false})
    @Column({comment: 'Активирован', type: BOOLEAN, defaultValue: false, allowNull: false})
    activated: boolean

    @ApiProperty({description: 'Заблокирован', example: false})
    @Column({comment: 'Заблокирован', type: BOOLEAN, defaultValue: false, allowNull: false})
    banned: boolean

}