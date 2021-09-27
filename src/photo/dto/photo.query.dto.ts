import {ArrayMaxSize, ArrayUnique, IsEnum, IsInt, Max, Min} from "class-validator";
import {Transform, Type} from "class-transformer";
import {SortColumn} from "../enum/sort.column.enum";
import {SortDirection} from "../enum/sort.direction.enum";

export class PhotoQueryDto {

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20)
    limit: number = 20

    @IsEnum(SortColumn)
    sortColumn: string = 'dateCreate'

    @IsEnum(SortDirection)
    sortDirection: string = 'DESC'

    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @ArrayUnique()
    years: number[] = []

    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @Min(1, {each: true})
    @Max(12, {each: true})
    @ArrayMaxSize(12)
    @ArrayUnique()
    months: number[] = []

    @Transform(({value}) => value.split(',').map(text => Number(text)))
    @IsInt({each: true})
    @Min(1, {each: true})
    @Max(31, {each: true})
    @ArrayMaxSize(31)
    @ArrayUnique()
    days: number[] = []

    @Type(() => Number)
    @IsInt()
    lastDate: number = Date.now()

}