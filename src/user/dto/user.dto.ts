import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../model/user.model";
import {PermissionDto} from "../../permission/dto/permission.dto";
import {IsBoolean, IsDate, IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength} from "class-validator";

export class UserDto {

    constructor(userModel: UserModel) {

        this.id = userModel.id
        this.username = userModel.username
        this.isSync = userModel.isSync

        this.cloudUsername = userModel.cloudUsername
        this.cloudPathScan = userModel.cloudPathScan
        this.cloudPathSync = userModel.cloudPathSync

        this.surname = userModel.surname
        this.name = userModel.name
        this.patronymic = userModel.patronymic
        this.birthday = userModel.birthday
        this.email = userModel.email
        this.phone = userModel.phone

        this.createdAt = userModel.createdAt
        this.updatedAt = userModel.updatedAt

        this.permissions = userModel.permissions?.map(permissionModel => new PermissionDto(permissionModel)) || []

    }

    @ApiProperty({
        description: 'Идентификатор',
        format: 'uuid'
    })
    readonly id: string

    @ApiProperty({
        description: 'Имя пользователя',
        example: 'user',
        minLength: 4
    })
    @MinLength(4)
    readonly username: string

    @ApiProperty({
        description: 'Состояние синхронизации',
        example: false,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    readonly isSync: boolean

    @ApiProperty({
        description: 'Облако - имя пользователя',
        example: 'user',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudUsername: string

    @ApiProperty({
        description: 'Облако - путь сканирования',
        example: 'Телефон/Фотографии',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudPathScan: string

    @ApiProperty({
        description: 'Облако - путь синхронизации',
        example: 'Семья/Фотографии',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudPathSync: string

    @ApiProperty({
        description: 'Фамилия',
        example: 'Фамилия',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly surname: string

    @ApiProperty({
        description: 'Имя',
        example: 'Имя',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly name: string

    @ApiProperty({
        description: 'Отчество',
        example: 'Отчество',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly patronymic: string

    @ApiProperty({
        description: 'День рождения',
        format: 'date-time',
        required: false
    })
    @IsOptional()
    @IsDate()
    readonly birthday: Date

    @ApiProperty({
        description: 'Электронная почта',
        format: 'email',
        required: false
    })
    @IsOptional()
    @IsEmail()
    readonly email: string

    @ApiProperty({
        description: 'Телефон',
        example: '+79995553311',
        required: false
    })
    @IsOptional()
    @IsPhoneNumber()
    readonly phone: string

    @ApiProperty({
        description: 'Дата создания',
        format: 'date-time'
    })
    @IsDate()
    readonly createdAt: Date

    @ApiProperty({
        description: 'Дата изменения',
        format: 'date-time'
    })
    @IsDate()
    readonly updatedAt: Date

    @ApiProperty({
        description: 'Разрешения',
        type: [PermissionDto]
    })
    readonly permissions: PermissionDto[]

}
