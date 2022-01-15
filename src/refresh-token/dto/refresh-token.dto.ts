import {ApiProperty} from "@nestjs/swagger";
import {RefreshTokenModel} from "../model/refresh-token.model";
import {IsDate} from "class-validator";

export class RefreshTokenDto {

    constructor(tokenModel: RefreshTokenModel) {

        this.id = tokenModel.id
        this.user = tokenModel.user
        this.value = tokenModel.value
        this.expiredAt = tokenModel.expiredAt

        this.host = tokenModel.host
        this.userAgent = tokenModel.userAgent

        this.createdAt = tokenModel.createdAt
        this.updatedAt = tokenModel.updatedAt

    }

    @ApiProperty({
        description: 'Идентификатор',
        format: 'uuid'
    })
    readonly id: string

    @ApiProperty({
        description: 'Пользователь',
        format: 'uuid'
    })
    readonly user: string

    @ApiProperty({
        description: 'Хост',
        format: 'hostname'
    })
    readonly host: string

    @ApiProperty({
        description: 'Клиентское приложение',
        example: 'PostmanRuntime'
    })
    readonly userAgent: string

    @ApiProperty({
        description: 'Значение',
        format: 'crypto'
    })
    readonly value: string

    @ApiProperty({
        description: 'Дата истекания',
        format: 'date-time'
    })
    @IsDate()
    readonly expiredAt: Date

    @ApiProperty({
        description: 'Дата создания',
        format: 'date-time'
    })
    @IsDate()
    readonly createdAt: Date

    @ApiProperty({
        description: 'Дата изменения',
        format: 'date-time'
    })
    @IsDate()
    readonly updatedAt: Date

}
