import {IsEnum, IsInt, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {SortDirection} from "../enum/sort.direction.enum";
import {ApiProperty} from "@nestjs/swagger";
import {PhotoFindTotalDto} from "./photo.find.total.dto";
import {DateColumn} from "../enum/date.column.enum";

export class PhotoFindAllDto extends PhotoFindTotalDto {

    @ApiProperty({description: 'Колонка для сортировки', example: 'dateCreate', required: false, enum: DateColumn})
    @IsEnum(DateColumn)
    readonly dateColumn: string = 'dateCreate'

    @ApiProperty({description: 'Направление сортировки', example: 'DESC', required: false, enum: SortDirection})
    @IsEnum(SortDirection)
    readonly sortDirection: string = 'DESC'

    @ApiProperty({description: 'Количество', example: '5', required: false})
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(100)
    readonly limit: number = 1

    @ApiProperty({description: 'Отступ', example: '10', required: false})
    @Type(() => Number)
    @IsInt()
    @Min(0)
    readonly offset: number = 0

}