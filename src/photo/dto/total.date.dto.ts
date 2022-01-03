import {TotalDatePartDto} from "./total.date.part.dto";
import {ApiProperty} from "@nestjs/swagger";

export class TotalDateDto {

    @ApiProperty({
        description: 'Количество по годам',
        type: [TotalDatePartDto],
        example: []
    })
    years: TotalDatePartDto[]

    @ApiProperty({
        description: 'Количество по месяцам',
        type: [TotalDatePartDto],
        example: []
    })
    months: TotalDatePartDto[]

    @ApiProperty({
        description: 'Количество по дням',
        type: [TotalDatePartDto],
        example: []
    })
    days: TotalDatePartDto[]

}
