import {ArrayMaxSize, ArrayUnique, IsEnum, IsInt, Max, Min} from "class-validator";
import {Transform, Type} from "class-transformer";
import {SortColumn} from "../enum/sort.column.enum";
import {SortDirection} from "../enum/sort.direction.enum";
import {ApiProperty} from "@nestjs/swagger";

export class PhotoQueryDto {

    @ApiProperty({description: 'Количество', example: '20', required: false})
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    readonly limit: number = 5

    @ApiProperty({description: 'Колонка для сортировки', example: 'dateCreate', required: false, enum: SortColumn})
    @IsEnum(SortColumn)
    readonly sortColumn: string = 'dateCreate'

    @ApiProperty({description: 'Направление сортировки', example: 'DESC', required: false, enum: SortDirection})
    @IsEnum(SortDirection)
    readonly sortDirection: string = 'DESC'

    @ApiProperty({description: 'Года', example: '2020,2021', required: false})
    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @ArrayUnique()
    readonly years: number[] = []

    @ApiProperty({description: 'Месяцы', example: '10,11,12', required: false})
    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @Min(1, {each: true})
    @Max(12, {each: true})
    @ArrayMaxSize(12)
    @ArrayUnique()
    readonly months: number[] = []

    @ApiProperty({description: 'Дни', example: '24,25,26,27', required: false})
    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @Min(1, {each: true})
    @Max(31, {each: true})
    @ArrayMaxSize(31)
    @ArrayUnique()
    readonly days: number[] = []

    @ApiProperty({description: 'Время начала', example: '1632748863981', required: false})
    @Type(() => Number)
    @IsInt()
    readonly timeStart: number = Date.now()

}