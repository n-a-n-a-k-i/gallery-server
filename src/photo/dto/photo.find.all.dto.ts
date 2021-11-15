import {IsEnum, IsInt, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {SortDirection} from "../enum/sort.direction.enum";
import {ApiProperty} from "@nestjs/swagger";
import {PhotoFindTotalDto} from "./photo.find.total.dto";
import {DateColumn} from "../enum/date.column.enum";

export class PhotoFindAllDto extends PhotoFindTotalDto {

    @ApiProperty({description: 'Время начала', example: '1632748863981', required: false})
    @Type(() => Number)
    @IsInt()
    readonly timeStart: number = Date.now()

    @ApiProperty({description: 'Количество', example: '20', required: false})
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(100)
    readonly limit: number = 5

    @ApiProperty({description: 'Колонка для сортировки', example: 'dateCreate', required: false, enum: DateColumn})
    @IsEnum(DateColumn)
    readonly dateColumn: string = 'dateCreate'

    @ApiProperty({description: 'Направление сортировки', example: 'DESC', required: false, enum: SortDirection})
    @IsEnum(SortDirection)
    readonly sortDirection: string = 'DESC'

}