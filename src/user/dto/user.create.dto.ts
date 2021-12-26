import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength} from "class-validator";

export class UserCreateDto {

    @ApiProperty({description: 'Имя пользователя', example: 'user'})
    @MinLength(4)
    readonly username: string

    @ApiProperty({description: 'Пароль', example: 'bcrypt#12345678'})
    @MinLength(8)
    readonly password: string

    @ApiProperty({description: 'Имя пользователя в облаке', example: 'user'})
    @IsOptional()
    @IsString()
    readonly cloudUsername: string

    @ApiProperty({description: 'Пароль в облаке', example: '12345678'})
    @IsOptional()
    @IsString()
    readonly cloudPassword: string

    @ApiProperty({description: 'Директория сканирования в облаке', example: 'Телефон/Фотографии'})
    @IsOptional()
    @IsString()
    readonly cloudDirScan: string

    @ApiProperty({description: 'Директория синхронизации в облаке', example: 'Семья/Фотографии'})
    @IsOptional()
    @IsString()
    readonly cloudDirSync: string

    @ApiProperty({description: 'Фамилия', example: 'Фамилия'})
    @IsOptional()
    @IsString()
    readonly surname: string

    @ApiProperty({description: 'Имя', example: 'Имя'})
    @IsOptional()
    @IsString()
    readonly name: string

    @ApiProperty({description: 'Отчество', example: 'Отчество'})
    @IsOptional()
    @IsString()
    readonly patronymic: string

    @ApiProperty({description: 'День рождения', example: '1991-12-03T16:02:00.000Z'})
    @IsOptional()
    @IsDate()
    readonly birthday: Date

    @ApiProperty({description: 'Электронная почта', example: 'user@gallery.nanaki'})
    @IsOptional()
    @IsEmail()
    readonly email: string

    @ApiProperty({description: 'Телефон', example: '+79995553311'})
    @IsOptional()
    @IsPhoneNumber()
    readonly phone: string

}
