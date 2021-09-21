import {Controller, HttpCode, Post, Req, Res, UseGuards} from "@nestjs/common";
import {LocalAuthGuard} from "./guard/local.auth.guard";
import {AccountService} from "./account.service";
import {Public} from "./decorator/public.decorator";
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AccountSignInResponseDto} from "./dto/account.sign.in.response.dto";
import {AccountSignInRequestDto} from "./dto/account.sign.in.request.dto";
import {RequestWithUser} from "./interface/request.with.user.interface";
import {Response} from "express";

@ApiTags('Аккаунт')
@Controller('account')
export class AccountController {

    constructor(private accountService: AccountService) {
    }

    @ApiOperation({summary: 'Войти'})
    @ApiResponse({type: AccountSignInResponseDto})
    @ApiBody({type: AccountSignInRequestDto})
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('/sign-in')
    async signIn(
        @Req() request: RequestWithUser,
        @Res({passthrough: true}) response: Response
    ): Promise<AccountSignInResponseDto> {

        const token = await this.accountService.signIn(request.user)
        const maxAge = eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000

        response.cookie('token', token.refresh, {httpOnly: true, maxAge, path: '/account/refresh'})
        response.cookie('token', token.refresh, {httpOnly: true, maxAge, path: '/account/log-out'})

        return new AccountSignInResponseDto(token.access)

    }

}