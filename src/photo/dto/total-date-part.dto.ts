import {ApiProperty} from "@nestjs/swagger";
import {PhotoModel} from "../model/photo.model";

export class TotalDatePartDto {

    constructor(photoModel: PhotoModel) {
        this.value = Number(photoModel.get('value'))
        this.total = Number(photoModel.get('total'))
    }

    @ApiProperty({
        description: 'Значение части даты',
        example: 2020
    })
    readonly value: number

    @ApiProperty({
        description: 'Количество',
        example: 9000
    })
    readonly total: number

}
