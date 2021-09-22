import {ApiProperty} from "@nestjs/swagger";

export class SignInDto {

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    readonly username: string

    @ApiProperty({description: 'Пароль', example: 'bcrypt#12345678'})
    readonly password: string

}