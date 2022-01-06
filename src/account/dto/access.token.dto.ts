import {ApiProperty} from "@nestjs/swagger";
import {Token} from "../interface/token.interface";
import {IsString} from "class-validator";

export class AccessTokenDto {

    constructor(token: Token) {
        this.accessToken = token.accessToken
    }

    @ApiProperty({
        description: 'Токен доступа',
        format: 'jwt'
    })
    @IsString()
    readonly accessToken: string

}
