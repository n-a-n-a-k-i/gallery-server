import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../model/user.model";
import {PermissionDto} from "../../permission/dto/permission.dto";
import {IsDate, IsEmail, IsPhoneNumber, IsString} from "class-validator";

export class UserDto {

    constructor(userModel: UserModel) {
        this.id = userModel.id
        this.username = userModel.username
        this.cloudUsername = userModel.cloudUsername
        this.cloudDirScan = userModel.cloudDirScan
        this.cloudDirSync = userModel.cloudDirSync
        this.surname = userModel.surname
        this.name = userModel.name
        this.patronymic = userModel.patronymic
        this.birthday = userModel.birthday
        this.email = userModel.email
        this.phone = userModel.phone
        this.permissions = userModel.permissions?.map(permissionModel => new PermissionDto(permissionModel)) || []
    }

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    readonly id: string

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    readonly username: string

    @ApiProperty({description: 'Имя пользователя в облаке', example: 'user'})
    readonly cloudUsername: string

    @ApiProperty({description: 'Директория сканирования в облаке', example: 'Телефон/Фотографии'})
    readonly cloudDirScan: string

    @ApiProperty({description: 'Директория синхронизации в облаке', example: 'Семья/Фотографии'})
    readonly cloudDirSync: string

    @ApiProperty({description: 'Фамилия', example: 'Фамилия'})
    @IsString()
    readonly surname: string

    @ApiProperty({description: 'Имя', example: 'Имя'})
    @IsString()
    readonly name: string

    @ApiProperty({description: 'Отчество', example: 'Отчество'})
    @IsString()
    readonly patronymic: string

    @ApiProperty({description: 'День рождения', example: '1991-12-03T16:02:00.000Z'})
    @IsDate()
    readonly birthday: Date

    @ApiProperty({description: 'Электронная почта', example: 'user@gallery.nanaki'})
    @IsEmail()
    readonly email: string

    @ApiProperty({description: 'Телефон', example: '+79995553311'})
    @IsPhoneNumber()
    readonly phone: string

    @ApiProperty({description: 'Разрешения', type: [PermissionDto]})
    readonly permissions: PermissionDto[]

}