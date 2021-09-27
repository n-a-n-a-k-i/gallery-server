import {ApiProperty} from "@nestjs/swagger";
import {IsString, MinLength} from "class-validator";

export class UserCreateDto {

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    @MinLength(4)
    readonly username: string

    @ApiProperty({description: 'Пароль', example: 'bcrypt#12345678'})
    @MinLength(8)
    readonly password: string

    @ApiProperty({description: 'Имя пользователя в облаке', example: 'user'})
    @IsString()
    readonly cloudUsername: string = ''

    @ApiProperty({description: 'Пароль в облаке', example: '12345678'})
    @IsString()
    readonly cloudPassword: string = ''

    @ApiProperty({description: 'Директория сканирования в облаке', example: 'Телефон/Фотографии'})
    @IsString()
    readonly cloudDirScan: string = ''

    @ApiProperty({description: 'Директория синхронизации в облаке', example: 'Семья/Фотографии'})
    @IsString()
    readonly cloudDirSync: string = ''

}