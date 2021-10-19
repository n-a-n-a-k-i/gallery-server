import {Controller, Get, HttpCode, Post, Req, Res, UseGuards} from "@nestjs/common";
import {LocalGuard} from "./guard/local.guard";
import {AccountService} from "./account.service";
import {Public} from "./decorator/public.decorator";
import {ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Response} from "express";
import {JwtRefreshTokenGuard} from "./guard/jwt.refresh.token.guard";
import {AccessTokenDto} from "./dto/access.token.dto";
import {SignInDto} from "./dto/sign.in.dto";
import {RequestWithUser} from "./interface/request.with.user.interface";
import {RequestWithUserAndCookieRefreshToken} from "./interface/request.with.user.and.cookie.refresh.token.interface";

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

        const payload = request.user
        const {accessToken, refreshToken} = await this.accountService.signIn(payload)
        const maxAge = eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000

        response.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge, path: '/account/refresh'})
        response.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge, path: '/account/sign-out'})

        return {accessToken}

    }

    @ApiOperation({summary: 'Обновить токен'})
    @ApiResponse({type: AccessTokenDto})
    @ApiCookieAuth('refreshToken')
    @Public()
    @UseGuards(JwtRefreshTokenGuard)
    @Get('/refresh')
    async refresh(
        @Req() request: RequestWithUserAndCookieRefreshToken,
        @Res({passthrough: true}) response: Response
    ): Promise<AccessTokenDto> {

        const {
            accessToken,
            refreshToken
        } = await this.accountService.refresh(request.user, request.cookies.refreshToken)
        const maxAge = eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000

        response.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge, path: '/account/refresh'})
        response.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge, path: '/account/sign-out'})

        return {accessToken}

    }

    @ApiOperation({summary: 'Выйти'})
    @ApiCookieAuth('refreshToken')
    @Public()
    @UseGuards(JwtRefreshTokenGuard)
    @Get('/sign-out')
    async signOut(
        @Req() request: RequestWithUserAndCookieRefreshToken,
        @Res({passthrough: true}) response: Response
    ): Promise<void> {

        await this.accountService.signOut(request.cookies.refreshToken)
        response.clearCookie('refreshToken', {path: '/account/refresh'})
        response.clearCookie('refreshToken', {path: '/account/sign-out'})

    }

}