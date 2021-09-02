import {ApiProperty} from "@nestjs/swagger";

export class UserSignUpDto {

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    readonly username: string

    @ApiProperty({description: 'Пароль', example: '12345678'})
    readonly password: string

    @ApiProperty({description: 'Электронная почта', example: 'user@gallery.nanaki'})
    readonly email: string

}