import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength} from "class-validator";

export class UserCreateDto {

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

    @ApiProperty({
        description: 'Имя пользователя в облаке',
        example: 'user',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudUsername: string

    @ApiProperty({
        description: 'Пароль в облаке',
        example: '12345678',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudPassword: string

    @ApiProperty({
        description: 'Директория сканирования в облаке',
        example: 'Телефон/Фотографии',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudDirScan: string

    @ApiProperty({
        description: 'Директория синхронизации в облаке',
        example: 'Семья/Фотографии',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudDirSync: string

    @ApiProperty({
        description: 'Фамилия',
        example: 'Фамилия',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly surname: string

    @ApiProperty({
        description: 'Имя',
        example: 'Имя',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly name: string

    @ApiProperty({
        description: 'Отчество',
        example: 'Отчество',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly patronymic: string

    @ApiProperty({
        description: 'День рождения',
        format: 'date-time',
        required: false
    })
    @IsOptional()
    @IsDate()
    readonly birthday: Date

    @ApiProperty({
        description: 'Электронная почта',
        format: 'email',
        required: false
    })
    @IsOptional()
    @IsEmail()
    readonly email: string

    @ApiProperty({
        description: 'Телефон',
        example: '+79995553311',
        required: false
    })
    @IsOptional()
    @IsPhoneNumber()
    readonly phone: string

}
