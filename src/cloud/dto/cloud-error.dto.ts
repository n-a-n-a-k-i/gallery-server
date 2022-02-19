import {ApiProperty} from "@nestjs/swagger";
import {CloudErrorType} from "../enum/cloud-error-type.enum";

export class CloudErrorDto {

    constructor(message: string, data: string) {
        this.message = message
        this.data = data
    }

    @ApiProperty({
        description: 'Тип ошибки',
        enum: CloudErrorType,
        example: CloudErrorType.SOMETHING_WENT_WRONG
    })
    type: CloudErrorType = CloudErrorType.SOMETHING_WENT_WRONG

    @ApiProperty({
        description: 'Сообщение',
        example: 'Сообщение'
    })
    message: string

    @ApiProperty({
        description: 'Данные',
        example: 'Данные'
    })
    data: string

}
