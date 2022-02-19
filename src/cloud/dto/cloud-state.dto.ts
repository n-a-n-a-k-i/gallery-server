import {ApiProperty} from "@nestjs/swagger";
import {CloudErrorDto} from "./cloud-error.dto";

export class CloudStateDto {

    constructor(isEnabled: boolean) {
        this.isEnabled = isEnabled
    }

    @ApiProperty({
        description: 'Состояние включённости',
        example: false
    })
    isEnabled: boolean

    @ApiProperty({
        description: 'Состояние выполнения',
        example: false
    })
    isLoop: boolean = false

    @ApiProperty({
        description: 'Счётчик',
        example: 0
    })
    i: number = 0

    @ApiProperty({
        description: 'Ошибки',
        type: [CloudErrorDto]
    })
    errors: CloudErrorDto[] = []

}
