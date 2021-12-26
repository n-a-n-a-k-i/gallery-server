import {BelongsToMany, Column, HasMany, Model, Table} from "sequelize-typescript";
import {DATE, literal, TEXT, UUID} from "sequelize";
import {ApiProperty} from "@nestjs/swagger";
import {UserCreateDto} from "../dto/user.create.dto";
import {PermissionModel} from "../../permission/model/permission.model";
import {UserPermissionModel} from "../../user.permission/model/user.permission.model";
import {RefreshTokenModel} from "../../refresh.token/model/refresh.token.model";

@Table({comment: 'Пользователь', tableName: 'user'})
export class UserModel extends Model<UserModel, UserCreateDto> {

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

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    @Column({comment: 'Имя пользователя', type: TEXT, allowNull: false, unique: true})
    username: string

    @ApiProperty({description: 'Пароль', example: 'bcrypt#12345678'})
    @Column({comment: 'Пароль', type: TEXT, allowNull: false})
    password: string

    @ApiProperty({description: 'Имя пользователя в облаке', example: 'user'})
    @Column({comment: 'Имя пользователя в облаке', type: TEXT})
    cloudUsername: string

    @ApiProperty({description: 'Пароль в облаке', example: '12345678'})
    @Column({comment: 'Пароль в облаке', type: TEXT})
    cloudPassword: string

    @ApiProperty({description: 'Директория сканирования в облаке', example: 'Телефон/Фотографии'})
    @Column({comment: 'Директория сканирования в облаке', type: TEXT})
    cloudDirScan: string

    @ApiProperty({description: 'Директория синхронизации в облаке', example: 'Семья/Фотографии'})
    @Column({comment: 'Директория синхронизации в облаке', type: TEXT})
    cloudDirSync: string

    @ApiProperty({description: 'Фамилия', example: 'Фамилия'})
    @Column({comment: 'Фамилия', type: TEXT})
    surname: string

    @ApiProperty({description: 'Имя', example: 'Имя'})
    @Column({comment: 'Имя', type: TEXT})
    name: string

    @ApiProperty({description: 'Отчество', example: 'Отчество'})
    @Column({comment: 'Отчество', type: TEXT})
    patronymic: string

    @ApiProperty({description: 'День рождения', example: '1991-12-03T16:02:00.000Z'})
    @Column({comment: 'День рождения', type: DATE})
    birthday: Date

    @ApiProperty({description: 'Электронная почта', example: 'user@gallery.nanaki'})
    @Column({comment: 'Электронная почта', type: TEXT})
    email: string

    @ApiProperty({description: 'Телефон', example: '+79995553311'})
    @Column({comment: 'Телефон', type: TEXT})
    phone: string

    @HasMany(() => RefreshTokenModel)
    tokens: RefreshTokenModel[]

    @BelongsToMany(() => PermissionModel, () => UserPermissionModel)
    permissions: PermissionModel[]

}
