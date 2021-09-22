import {ApiProperty} from "@nestjs/swagger";

export class UserCreateDto {

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    readonly username: string

    @ApiProperty({description: 'Пароль', example: 'bcrypt#12345678'})
    readonly password: string

    @ApiProperty({description: 'Имя пользователя в облаке', example: 'user'})
    readonly cloudUsername: string

    @ApiProperty({description: 'Пароль в облаке', example: '12345678'})
    readonly cloudPassword: string

    @ApiProperty({description: 'Директория сканирования в облаке', example: 'Телефон/Фотографии'})
    readonly cloudDirScan: string

    @ApiProperty({description: 'Директория синхронизации в облаке', example: 'Семья/Фотографии'})
    readonly cloudDirSync: string

}