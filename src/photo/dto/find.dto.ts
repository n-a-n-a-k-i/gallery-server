import {IsEnum, IsInt, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {FindTotalDto} from "./find.total.dto";
import {OrderDirection} from "../enum/order.direction.enum";

export class FindDto extends FindTotalDto {

    @ApiProperty({
        description: 'Направление сортировки',
        enum: OrderDirection,
        example: OrderDirection.DESC,
        required: false
    })
    @IsEnum(OrderDirection)
    readonly orderDirection: OrderDirection = OrderDirection.DESC

    @ApiProperty({
        description: 'Количество',
        example: 1,
        required: false,
        minimum: 0,
        maximum: 100
    })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(100)
    readonly limit: number = 1

    @ApiProperty({
        description: 'Отступ',
        example: 0,
        required: false,
        minimum: 0
    })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    readonly offset: number = 0

}
