import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../model/user.model";

export class UserPublicDto {

    constructor(userModel: UserModel) {
        this.id = userModel.id
        this.username = userModel.username
        this.email = userModel.email
        this.activated = userModel.activated
        this.banned = userModel.banned
    }

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    readonly id: string

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    readonly username: string

    @ApiProperty({description: 'Электронная почта', example: 'user@gallery.nanaki'})
    readonly email: string

    @ApiProperty({description: 'Активирован', example: false})
    readonly activated: boolean

    @ApiProperty({description: 'Заблокирован', example: false})
    readonly banned: boolean

}