import {ApiProperty} from "@nestjs/swagger";
import {TokenModel} from "../model/token.model";

export class TokenDto {

    constructor(tokenModel: TokenModel) {
        this.id = tokenModel.id
        this.value = tokenModel.value
        this.user = tokenModel.user
    }

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    readonly id: string

    @ApiProperty({description: 'Значение', example: 'xxxxx.yyyyy.zzzzz'})
    readonly value: string

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    readonly user: string

}