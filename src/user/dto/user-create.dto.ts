import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsDate, IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength} from "class-validator";

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
        description: 'Состояние синхронизации',
        example: false,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    readonly isSync: boolean

    @ApiProperty({
        description: 'Состояние очистки',
        example: false,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    readonly isClear: boolean

    @ApiProperty({
        description: 'Облако - имя пользователя',
        example: 'user',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudUsername: string

    @ApiProperty({
        description: 'Облако - пароль',
        example: '12345678',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudPassword: string

    @ApiProperty({
        description: 'Облако - путь сканирования',
        example: 'Телефон/Фотографии',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudPathScan: string

    @ApiProperty({
        description: 'Облако - путь синхронизации',
        example: 'Семья/Фотографии',
        required: false
    })
    @IsOptional()
    @IsString()
    readonly cloudPathSync: string

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
