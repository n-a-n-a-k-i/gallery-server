import {Controller, Get} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RefreshTokenDto} from "./dto/refresh.token.dto";
import {RefreshTokenService} from "./refresh.token.service";

@ApiTags('Токен обновления')
@Controller('refresh-token')
export class RefreshTokenController {

    constructor(private readonly refreshTokenService: RefreshTokenService) {
    }

    @ApiOperation({summary: 'Получить все токены'})
    @ApiResponse({type: [RefreshTokenDto]})
    @ApiBearerAuth('access-token')
    @Get()
    async findAll(): Promise<RefreshTokenDto[]> {
        const tokenModels = await this.refreshTokenService.findAll()
        return tokenModels.map(tokenModel => new RefreshTokenDto(tokenModel))
    }

}
