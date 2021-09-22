import {ApiProperty} from "@nestjs/swagger";

export class AccessTokenDto {

    @ApiProperty({description: 'Токен доступа', example: 'xxxxx.yyyyy.zzzzz'})
    readonly token: string

}