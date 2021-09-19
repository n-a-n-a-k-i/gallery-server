import {Controller, HttpCode, Post, Request, UseGuards} from "@nestjs/common";
import {LocalAuthGuard} from "./guard/local.auth.guard";
import {AccountService} from "./account.service";
import {Public} from "./decorator/public.decorator";
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AccountSignInResponseDto} from "./dto/account.sign.in.response.dto";
import {AccountSignInRequestDto} from "./dto/account.sign.in.request.dto";
import {RequestWithUser} from "./interface/request.with.user.interface";

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
    async signIn(@Request() request: RequestWithUser): Promise<AccountSignInResponseDto> {
        return this.accountService.signIn(request.user)
    }

}