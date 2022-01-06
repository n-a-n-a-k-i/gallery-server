import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../model/user.model";
import {PermissionDto} from "../../permission/dto/permission.dto";
import {IsDate, IsEmail, IsPhoneNumber, IsString} from "class-validator";

export class UserDto {

    constructor(userModel: UserModel) {

        this.id = userModel.id
        this.username = userModel.username

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
        example: 'user'
    })
    readonly username: string

    @ApiProperty({
        description: 'Облако - имя пользователя',
        example: 'user',
        required: false
    })
    readonly cloudUsername: string

    @ApiProperty({
        description: 'Облако - путь сканирования',
        example: 'Телефон/Фотографии',
        required: false
    })
    readonly cloudPathScan: string

    @ApiProperty({
        description: 'Облако - путь синхронизации',
        example: 'Семья/Фотографии',
        required: false
    })
    readonly cloudPathSync: string

    @ApiProperty({
        description: 'Фамилия',
        example: 'Фамилия',
        required: false
    })
    @IsString()
    readonly surname: string

    @ApiProperty({
        description: 'Имя',
        example: 'Имя',
        required: false
    })
    @IsString()
    readonly name: string

    @ApiProperty({
        description: 'Отчество',
        example: 'Отчество',
        required: false
    })
    @IsString()
    readonly patronymic: string

    @ApiProperty({
        description: 'День рождения',
        format: 'date-time',
        required: false
    })
    @IsDate()
    readonly birthday: Date

    @ApiProperty({
        description: 'Электронная почта',
        format: 'email',
        required: false
    })
    @IsEmail()
    readonly email: string

    @ApiProperty({
        description: 'Телефон',
        example: '+79995553311',
        required: false
    })
    @IsPhoneNumber()
    readonly phone: string

    @ApiProperty({
        description: 'Дата создания',
        format: 'date-time'
    })
    readonly createdAt: Date

    @ApiProperty({
        description: 'Дата изменения',
        format: 'date-time'
    })
    readonly updatedAt: Date

    @ApiProperty({
        description: 'Разрешения',
        type: [PermissionDto]
    })
    readonly permissions: PermissionDto[]

}
