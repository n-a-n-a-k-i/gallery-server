import {BelongsToMany, Column, HasMany, Model, Table} from "sequelize-typescript";
import {DATE, literal, TEXT, UUID} from "sequelize";
import {ApiProperty} from "@nestjs/swagger";
import {UserCreateDto} from "../dto/user.create.dto";
import {PermissionModel} from "../../permission/model/permission.model";
import {UserPermissionModel} from "../../user.permission/model/user.permission.model";
import {RefreshTokenModel} from "../../refresh.token/model/refresh.token.model";

@Table({comment: 'Пользователь', tableName: 'user'})
export class UserModel extends Model<UserModel, UserCreateDto> {

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
        description: 'Имя пользователя',
        example: 'user'
    })
    @Column({
        comment: 'Имя пользователя',
        type: TEXT,
        allowNull: false,
        unique: true
    })
    username: string

    @ApiProperty({
        description: 'Пароль',
        format: 'bcrypt',
        example: '12345678',
        minLength: 8
    })
    @Column({
        comment: 'Пароль',
        type: TEXT,
        allowNull: false
    })
    password: string

    @ApiProperty({
        description: 'Облако - имя пользователя',
        example: 'user',
        required: false
    })
    @Column({
        comment: 'Облако - имя пользователя',
        type: TEXT
    })
    cloudUsername: string

    @ApiProperty({
        description: 'Облако - пароль',
        example: '12345678',
        required: false
    })
    @Column({
        comment: 'Облако - пароль',
        type: TEXT
    })
    cloudPassword: string

    @ApiProperty({
        description: 'Облако - путь сканирования',
        example: 'Телефон/Фотографии',
        required: false
    })
    @Column({
        comment: 'Облако - путь сканирования',
        type: TEXT
    })
    cloudPathScan: string

    @ApiProperty({
        description: 'Облако - путь синхронизации',
        example: 'Семья/Фотографии',
        required: false
    })
    @Column({
        comment: 'Облако - путь синхронизации',
        type: TEXT
    })
    cloudPathSync: string

    @ApiProperty({
        description: 'Фамилия',
        example: 'Фамилия',
        required: false
    })
    @Column({
        comment: 'Фамилия',
        type: TEXT
    })
    surname: string

    @ApiProperty({
        description: 'Имя',
        example: 'Имя',
        required: false
    })
    @Column({
        comment: 'Имя',
        type: TEXT
    })
    name: string

    @ApiProperty({
        description: 'Отчество',
        example: 'Отчество',
        required: false
    })
    @Column({
        comment: 'Отчество',
        type: TEXT
    })
    patronymic: string

    @ApiProperty({
        description: 'День рождения',
        format: 'date-time',
        required: false
    })
    @Column({
        comment: 'День рождения',
        type: DATE
    })
    birthday: Date

    @ApiProperty({
        description: 'Электронная почта',
        format: 'email',
        required: false
    })
    @Column({
        comment: 'Электронная почта',
        type: TEXT
    })
    email: string

    @ApiProperty({
        description: 'Телефон',
        example: '+79995553311',
        required: false
    })
    @Column({
        comment: 'Телефон',
        type: TEXT
    })
    phone: string

    @HasMany(() => RefreshTokenModel)
    tokens: RefreshTokenModel[]

    @BelongsToMany(
        () => PermissionModel,
        () => UserPermissionModel
    )
    permissions: PermissionModel[]

}
