import {ApiProperty} from "@nestjs/swagger";

export class UserCreateDto {

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    readonly username: string

    @ApiProperty({description: 'Пароль', example: '12345678'})
    readonly password: string

    @ApiProperty({description: 'Электронная почта', example: 'user@gallery.nanaki'})
    readonly email: string

    @ApiProperty({description: 'Активирован', example: false})
    readonly activated: boolean

    @ApiProperty({description: 'Заблокирован', example: false})
    readonly banned: boolean

}