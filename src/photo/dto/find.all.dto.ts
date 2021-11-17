import {IsEnum, IsInt, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {FindTotalDto} from "./find.total.dto";
import {OrderColumn} from "../enum/order.column.enum";
import {OrderDirection} from "../enum/order.direction.enum";

export class FindAllDto extends FindTotalDto {

    @ApiProperty({description: 'Колонка для сортировки', example: 'dateCreate', required: false, enum: OrderColumn})
    @IsEnum(OrderColumn)
    readonly orderColumn: string = 'dateCreate'

    @ApiProperty({description: 'Направление сортировки', example: 'DESC', required: false, enum: OrderDirection})
    @IsEnum(OrderDirection)
    readonly orderDirection: string = 'DESC'

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
