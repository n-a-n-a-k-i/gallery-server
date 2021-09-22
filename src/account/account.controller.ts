import {Controller, Get, HttpCode, Post, Req, Res, UseGuards} from "@nestjs/common";
import {LocalGuard} from "./guard/local.guard";
import {AccountService} from "./account.service";
import {Public} from "./decorator/public.decorator";
import {ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Response} from "express";
import {JwtRefreshTokenGuard} from "./guard/jwt.refresh.token.guard";
import {AccessTokenDto} from "./dto/access.token.dto";
import {SignInDto} from "./dto/sign.in.dto";
import {RequestUser} from "./interface/request.user.interface";
import {RequestUserCookie} from "./interface/request.user.cookie.interface";

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
        @Req() request: RequestUser,
        @Res({passthrough: true}) response: Response
    ): Promise<AccessTokenDto> {

        const payload = request.user
        const {accessToken, refreshToken} = await this.accountService.signIn(payload)
        const maxAge = eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000

        response.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge, path: '/account/refresh'})
        response.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge, path: '/account/log-out'})

        return {accessToken}

    }

    @ApiOperation({summary: 'Обновить токен'})
    @ApiResponse({type: AccessTokenDto})
    @ApiCookieAuth('refresh-token')
    @Public()
    @UseGuards(JwtRefreshTokenGuard)
    @Get('/refresh')
    async refresh(
        @Req() request: RequestUserCookie,
        @Res({passthrough: true}) response: Response
    ): Promise<AccessTokenDto> {
        const oldPayload = request.user
        const oldRefreshToken = request.cookies.refreshToken
        const {accessToken, refreshToken} = await this.accountService.refresh(oldPayload, oldRefreshToken)
        const maxAge = eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000

        response.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge, path: '/account/refresh'})
        response.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge, path: '/account/log-out'})

        return {accessToken}

    }

}