import {ApiProperty} from "@nestjs/swagger";
import {IsEnum} from "class-validator";
import {DatePart} from "../enum/date.part.enum";

export class FindTotalDatePartDto {

    @ApiProperty({description: 'Часть даты', example: 'year', required: false, enum: DatePart})
    @IsEnum(DatePart)
    readonly datePart: string = 'year'

}