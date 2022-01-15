import {Controller, Get, Headers, HttpCode, Post, Req, Res, UseGuards} from "@nestjs/common";
import {LocalGuard} from "./guard/local.guard";
import {AccountService} from "./account.service";
import {Public} from "./decorator/public.decorator";
import {ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Response} from "express";
import {JwtRefreshTokenGuard} from "./guard/jwt-refresh-token.guard";
import {AccessTokenDto} from "./dto/access-token.dto";
import {SignInDto} from "./dto/sign-in.dto";
import {RequestWithUser} from "./interface/request-with-user.interface";
import {RequestWithUserAndCookieRefreshToken} from "./interface/request-with-user-and-cookie-refresh-token.interface";
import {Token} from "./interface/token.interface";
import {UserDto} from "../user/dto/user.dto";
import {User} from "./interface/user.interface";
import {RefreshTokenDto} from "../refresh-token/dto/refresh-token.dto";
import {RefreshTokenService} from "../refresh-token/refresh-token.service";
import {UserService} from "../user/user.service";

@ApiTags('Аккаунт')
@Controller('account')
export class AccountController {

    constructor(
        private accountService: AccountService,
        private userService: UserService,
        private refreshTokenService :RefreshTokenService
    ) {}

    @ApiOperation({summary: 'Пользователь из запроса'})
    @ApiBearerAuth('accessToken')
    @Get()
    async get(@Req() request: RequestWithUser): Promise<User> {

        return request.user

    }

    @ApiOperation({summary: 'Поиск пользователя по пользователю из запроса'})
    @ApiResponse({type: UserDto})
    @ApiBearerAuth('accessToken')
    @Get('/user')
    async findUser(@Req() request: RequestWithUser): Promise<UserDto> {

        const userModel = await this.userService.findById(request.user.id)

        return new UserDto(userModel)

    }

    @ApiOperation({summary: 'Поиск токенов обновления по пользователю из запроса'})
    @ApiResponse({type: [RefreshTokenDto]})
    @ApiBearerAuth('accessToken')
    @Get('/refresh-token')
    async findRefreshToken(@Req() request: RequestWithUser): Promise<RefreshTokenDto[]> {

        const tokenModels = await this.refreshTokenService.findByUser(request.user.id)

        return tokenModels.map(tokenModel => new RefreshTokenDto(tokenModel))

    }

    @ApiOperation({summary: 'Вход'})
    @ApiResponse({type: AccessTokenDto})
    @ApiBody({type: SignInDto})
    @HttpCode(200)
    @UseGuards(LocalGuard)
    @Public()
    @Post('/sign-in')
    async signIn(
        @Req() request: RequestWithUser,
        @Headers('host') host,
        @Headers('user-agent') userAgent,
        @Res({passthrough: true}) response: Response
    ): Promise<AccessTokenDto> {

        const token = await this.accountService.signIn(request.user, host, userAgent)

        this.setToken(response, token)

        return new AccessTokenDto(token)

    }

    @ApiOperation({summary: 'Обновление токенов'})
    @ApiResponse({type: AccessTokenDto})
    @ApiCookieAuth('refreshToken')
    @Public()
    @UseGuards(JwtRefreshTokenGuard)
    @Get('/refresh')
    async refresh(
        @Req() request: RequestWithUserAndCookieRefreshToken,
        @Headers('host') host,
        @Headers('user-agent') userAgent,
        @Res({passthrough: true}) response: Response
    ): Promise<AccessTokenDto> {

        const token = await this.accountService.refresh(request.user.id, request.cookies.refreshToken, host, userAgent)

        this.setToken(response, token)

        return new AccessTokenDto(token)

    }

    @ApiOperation({summary: 'Выход'})
    @ApiCookieAuth('refreshToken')
    @Public()
    @UseGuards(JwtRefreshTokenGuard)
    @Get('/sign-out')
    async signOut(
        @Req() request: RequestWithUserAndCookieRefreshToken,
        @Res({passthrough: true}) response: Response
    ): Promise<void> {

        await this.accountService.signOut(request.cookies.refreshToken)
        response.clearCookie('accessToken', {path: '/photo/thumbnail'})
        response.clearCookie('accessToken', {path: '/photo/preview'})
        response.clearCookie('refreshToken', {path: '/account/refresh'})
        response.clearCookie('refreshToken', {path: '/account/sign-out'})

    }

    /**
     * Установка Cookie:
     * 1. Токен доступа для запроса миниатюр и предпросмотров напрямую из src параметра в тегах img.
     * 2. Токен обновления для запроса новых токенов и выхода из системы.
     * @param response
     * @param token
     */
    setToken(response: Response, token: Token) {

        const secure = eval(process.env.HTTP_COOKIE_SECURE);

        [

            ['accessToken', process.env.JWT_ACCESS_TOKEN_EXPIRES_IN, '/photo/thumbnail'],
            ['accessToken', process.env.JWT_ACCESS_TOKEN_EXPIRES_IN, '/photo/preview'],
            ['refreshToken', process.env.JWT_REFRESH_TOKEN_EXPIRES_IN, '/account/refresh'],
            ['refreshToken', process.env.JWT_REFRESH_TOKEN_EXPIRES_IN, '/account/sign-out']

        ].forEach(([name, expiresIn, path]) => {

            response.cookie(name, token[name], {
                httpOnly: true,
                maxAge: eval(expiresIn),
                path,
                secure,
                sameSite: secure ? 'none' : 'lax'
            })

        })

    }

}
