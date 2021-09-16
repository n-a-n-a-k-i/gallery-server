import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../model/user.model";
import {PermissionDto} from "./permission.dto";

export class UserDto {

    constructor(userModel: UserModel) {
        this.id = userModel.id
        this.username = userModel.username
        this.cloudUsername = userModel.cloudUsername
        this.cloudDirScan = userModel.cloudDirScan
        this.cloudDirSync = userModel.cloudDirSync
        this.permissions = userModel.permissions.map(permissionModel => new PermissionDto(permissionModel))
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

    @ApiProperty({description: 'Разрешения', type: [PermissionDto]})
    readonly permissions: PermissionDto[]

}