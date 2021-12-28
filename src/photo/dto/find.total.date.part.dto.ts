import {ApiProperty} from "@nestjs/swagger";
import {IsEnum} from "class-validator";
import {DatePart} from "../enum/date.part.enum";
import {DateColumn} from "../enum/date.column.enum";

export class FindTotalDatePartDto {

    @ApiProperty({description: 'Часть даты', example: 'year', required: false, enum: DatePart})
    @IsEnum(DatePart)
    readonly datePart: string = 'year'

    @ApiProperty({description: 'Колонка с датой', example: 'date', required: false, enum: DateColumn})
    @IsEnum(DateColumn)
    readonly dateColumn: string = 'date'

}
