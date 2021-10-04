import {ApiProperty} from "@nestjs/swagger";
import {DateColumn} from "../enum/date.column.enum";
import {IsEnum} from "class-validator";
import {DatePart} from "../enum/date.part.enum";

export class PhotoFindTotalDatePartDto {

    @ApiProperty({description: 'Колонка с датой', example: 'dateCreate', required: false, enum: DateColumn})
    @IsEnum(DateColumn)
    readonly dateColumn: string = 'dateCreate'

    @ApiProperty({description: 'Часть даты', example: 'year', required: false, enum: DatePart})
    @IsEnum(DatePart)
    readonly datePart: string = 'year'

}