import {ApiProperty} from "@nestjs/swagger";

export class UserUpdatePasswordDto {

    @ApiProperty({description: 'Старый пароль', example: '12345678'})
    readonly oldPassword: string

    @ApiProperty({description: 'Новый пароль', example: '12345678'})
    readonly newPassword: string

    @ApiProperty({description: 'Новый пароль ещё раз', example: '12345678'})
    readonly newPasswordAgain: string

}