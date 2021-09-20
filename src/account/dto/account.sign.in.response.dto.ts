import {ApiProperty} from "@nestjs/swagger";

export class AccountSignInResponseDto {

    constructor(token: string) {
        this.token = token
    }

    @ApiProperty({description: 'Токен доступа', example: 'xxxxx.yyyyy.zzzzz'})
    readonly token: string

}