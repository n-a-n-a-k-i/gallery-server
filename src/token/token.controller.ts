import {Controller, Get} from '@nestjs/common';
import {TokenService} from "./token.service";
import {TokenDto} from "./dto/token.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Токен')
@Controller('token')
export class TokenController {

    constructor(private readonly tokenService: TokenService) {
    }

    @ApiOperation({summary: 'Получить все токены'})
    @ApiResponse({type: [TokenDto]})
    @Get()
    async findAll(): Promise<TokenDto[]> {
        const tokenModels = await this.tokenService.findAll()
        return tokenModels.map(tokenModel => new TokenDto(tokenModel))
    }

}
