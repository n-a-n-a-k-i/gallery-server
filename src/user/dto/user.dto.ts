import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../model/user.model";

export class UserDto {

    constructor(userModel: UserModel) {
        this.id = userModel.id
        this.username = userModel.username
        this.cloudUsername = userModel.cloudUsername
        this.cloudDirScan = userModel.cloudDirScan
        this.cloudDirSync = userModel.cloudDirSync
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

}