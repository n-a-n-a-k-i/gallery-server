import {ApiProperty} from "@nestjs/swagger";

export class AccountJwtValidateDto {

    constructor(payload: any) {
        this.id = payload.sub
        this.permissions = payload.permissions
    }

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    readonly id: string

    @ApiProperty({description: 'Разрешения', type: [String]})
    readonly permissions: string[]

}