import {ApiProperty} from "@nestjs/swagger";
import {RefreshTokenModel} from "../model/refresh.token.model";

export class RefreshTokenDto {

    constructor(tokenModel: RefreshTokenModel) {
        this.id = tokenModel.id
        this.user = tokenModel.user
        this.host = tokenModel.host
        this.userAgent = tokenModel.userAgent
        this.value = tokenModel.value
        this.expiredAt = tokenModel.expiredAt
        this.createdAt = tokenModel.createdAt
        this.updatedAt = tokenModel.updatedAt
    }

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    readonly id: string

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    readonly user: string

    @ApiProperty({description: 'Хост', example: 'localhost'})
    readonly host: string

    @ApiProperty({description: 'Клиентское приложение', example: 'PostmanRuntime/7.28.4'})
    readonly userAgent: string

    @ApiProperty({description: 'Значение', example: 'crypto#xxxxx.yyyyy.zzzzz'})
    readonly value: string

    @ApiProperty({description: 'Дата истекания', example: '2021-10-21T06:32:32.401Z'})
    readonly expiredAt: Date

    @ApiProperty({description: 'Дата создания', example: '2021-10-21T06:32:32.401Z'})
    readonly createdAt: Date

    @ApiProperty({description: 'Дата изменения', example: '2021-10-21T06:32:32.401Z'})
    readonly updatedAt: Date

}