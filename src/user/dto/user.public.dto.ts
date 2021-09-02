import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../model/user.model";

export class UserPublicDto {

    constructor(user: UserModel) {
        this.id = user.id
        this.username = user.username
        this.email = user.email
        this.activated = user.activated
        this.banned = user.banned
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