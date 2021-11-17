import {ApiProperty} from "@nestjs/swagger";
import {PhotoModel} from "../model/photo.model";

export class TotalDatePartDto {

    constructor(photoModel: PhotoModel) {
        this.value = Number(photoModel.get('value'))
        this.total = Number(photoModel.get('total'))
    }

    @ApiProperty({description: 'Значение части даты', example: '2021'})
    readonly value: number

    @ApiProperty({description: 'Всего', example: '9000'})
    readonly total: number

}