import {ApiProperty} from "@nestjs/swagger";
import {Token} from "../interface/token.interface";

export class AccessTokenDto {

    constructor(token: Token) {
        this.accessToken = token.accessToken
    }

    @ApiProperty({description: 'Токен доступа', example: 'xxxxx.yyyyy.zzzzz'})
    readonly accessToken: string

}