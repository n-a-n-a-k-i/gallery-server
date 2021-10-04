import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {ArrayMaxSize, ArrayUnique, IsInt, Max, Min} from "class-validator";

export class PhotoFindTotalDto {

    @ApiProperty({description: 'Дни', example: '24,25,26,27', required: false})
    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @Min(1, {each: true})
    @Max(31, {each: true})
    @ArrayMaxSize(31)
    @ArrayUnique()
    readonly days: number[] = []

    @ApiProperty({description: 'Месяцы', example: '10,11,12', required: false})
    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @Min(1, {each: true})
    @Max(12, {each: true})
    @ArrayMaxSize(12)
    @ArrayUnique()
    readonly months: number[] = []

    @ApiProperty({description: 'Года', example: '2020,2021', required: false})
    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @ArrayUnique()
    readonly years: number[] = []

}