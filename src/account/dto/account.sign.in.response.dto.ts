import {ApiProperty} from "@nestjs/swagger";

export class AccountSignInResponseDto {

    constructor(token: string) {
        this.token = token
    }

    @ApiProperty({description: 'Токен доступа', example: 'xxx.yyy.zzz'})
    readonly token: string

}