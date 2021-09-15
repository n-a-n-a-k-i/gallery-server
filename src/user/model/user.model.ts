import {Column, Model, Table} from "sequelize-typescript";
import {literal, TEXT, UUID} from "sequelize";
import {ApiProperty} from "@nestjs/swagger";
import {UserCreateDto} from "../dto/user.create.dto";

@Table({tableName: 'user', createdAt: false, updatedAt: false})
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

    @ApiProperty({description: 'Пароль', example: '12345678'})
    @Column({comment: 'Пароль', type: TEXT, allowNull: false})
    password: string

    @ApiProperty({description: 'Имя пользователя в облаке', example: 'user'})
    @Column({comment: 'Имя пользователя в облаке', type: TEXT, defaultValue: '', allowNull: false})
    cloudUsername: string

    @ApiProperty({description: 'Пароль в облаке', example: '12345678'})
    @Column({comment: 'Пароль в облаке', type: TEXT, defaultValue: '', allowNull: false})
    cloudPassword: string

    @ApiProperty({description: 'Директория сканирования в облаке', example: 'Телефон/Фотографии'})
    @Column({comment: 'Директория сканирования в облаке', type: TEXT, defaultValue: '', allowNull: false})
    cloudDirScan: string

    @ApiProperty({description: 'Директория синхронизации в облаке', example: 'Семья/Фотографии'})
    @Column({comment: 'Директория синхронизации в облаке', type: TEXT, defaultValue: '', allowNull: false})
    cloudDirSync: string

}