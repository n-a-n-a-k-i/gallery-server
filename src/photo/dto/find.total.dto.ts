import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {ArrayMaxSize, ArrayUnique, IsEnum, IsInt, Max, Min} from "class-validator";
import {DateColumn} from "../enum/date.column.enum";

export class FindTotalDto {

    @ApiProperty({description: 'Года', example: '2010,2020', required: false})
    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @ArrayUnique()
    readonly years: number[] = []

    @ApiProperty({description: 'Месяцы', example: '1,12', required: false})
    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @ArrayUnique()
    @ArrayMaxSize(12)
    @Min(1, {each: true})
    @Max(12, {each: true})
    readonly months: number[] = []

    @ApiProperty({description: 'Дни', example: '1,31', required: false})
    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @ArrayUnique()
    @ArrayMaxSize(31)
    @Min(1, {each: true})
    @Max(31, {each: true})
    readonly days: number[] = []

    @ApiProperty({description: 'Колонка с датой', example: 'date', required: false, enum: DateColumn})
    @IsEnum(DateColumn)
    readonly dateColumn: string = 'date'

}
