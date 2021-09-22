import {Controller, Get, HttpCode, Post, Req, Res, UseGuards} from "@nestjs/common";
import {LocalGuard} from "./guard/local.guard";
import {AccountService} from "./account.service";
import {Public} from "./decorator/public.decorator";
import {ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RequestWithUser} from "./interface/request.with.user.interface";
import {Response} from "express";
import {JwtRefreshTokenGuard} from "./guard/jwt.refresh.token.guard";
import {AccessTokenDto} from "./dto/access.token.dto";
import {SignInDto} from "./dto/sign.in.dto";

@ApiTags('Аккаунт')
@Controller('account')
export class AccountController {

    constructor(private accountService: AccountService) {
    }

    @ApiOperation({summary: 'Войти'})
    @ApiResponse({type: AccessTokenDto})
    @ApiBody({type: SignInDto})
    @HttpCode(200)
    @UseGuards(LocalGuard)
    @Public()
    @Post('/sign-in')
    async signIn(
        @Req() request: RequestWithUser,
        @Res({passthrough: true}) response: Response
    ): Promise<AccessTokenDto> {

        const token = await this.accountService.signIn(request.user)
        const maxAge = eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000

        response.cookie('token', token.refresh, {httpOnly: true, maxAge, path: '/account/refresh'})
        response.cookie('token', token.refresh, {httpOnly: true, maxAge, path: '/account/log-out'})

        return {token: token.access}

    }

    @ApiOperation({summary: 'Обновить токен'})
    @ApiResponse({type: AccessTokenDto})
    @ApiCookieAuth('refresh-token')
    @Public()
    @UseGuards(JwtRefreshTokenGuard)
    @Get('/refresh')
    async refresh(
        @Req() request: RequestWithUser,
        @Res({passthrough: true}) response: Response
    ) {
        console.log(request.user)
        console.log(request.cookies)
        return 'ok'
    }

}