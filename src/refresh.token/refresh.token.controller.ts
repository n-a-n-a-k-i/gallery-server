import {Controller, Get, Req} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RefreshTokenDto} from "./dto/refresh.token.dto";
import {RefreshTokenService} from "./refresh.token.service";
import {RequestWithUser} from "../account/interface/request.with.user.interface";

@ApiTags('Токен обновления')
@Controller('refresh-token')
export class RefreshTokenController {

    constructor(private readonly refreshTokenService: RefreshTokenService) {
    }

    @ApiOperation({summary: 'Получить все токены'})
    @ApiResponse({type: [RefreshTokenDto]})
    @ApiBearerAuth('accessToken')
    @Get('/account')
    async findByAccount(
        @Req() request: RequestWithUser
    ): Promise<RefreshTokenDto[]> {
        const tokenModels = await this.refreshTokenService.findByUser(request.user.id)
        return tokenModels.map(tokenModel => new RefreshTokenDto(tokenModel))
    }

}
