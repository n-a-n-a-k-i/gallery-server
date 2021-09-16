import {ApiProperty} from "@nestjs/swagger";

export class AccountSignInRequestDto {

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    readonly username: string

    @ApiProperty({description: 'Пароль', example: '12345678'})
    readonly password: string

}