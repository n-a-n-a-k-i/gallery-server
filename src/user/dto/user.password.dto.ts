import {ApiProperty} from "@nestjs/swagger";

export class UserPasswordDto {

    @ApiProperty({description: 'Пароль', example: '12345678'})
    readonly password: string

}