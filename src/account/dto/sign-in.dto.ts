import {ApiProperty} from "@nestjs/swagger";
import {MinLength} from "class-validator";

export class SignInDto {

    @ApiProperty({
        description: 'Имя пользователя',
        example: 'user',
        minLength: 4
    })
    @MinLength(4)
    readonly username: string

    @ApiProperty({
        description: 'Пароль',
        format: 'bcrypt',
        example: '12345678',
        minLength: 8
    })
    @MinLength(8)
    readonly password: string

}
