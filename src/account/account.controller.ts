import {Controller, Post, Request, UseGuards} from "@nestjs/common";
import {LocalAuthGuard} from "./guard/local.auth.guard";
import {AccountService} from "./account.service";

@Controller('account')
export class AccountController {

    constructor(private accountService: AccountService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('/sign/in')
    async signIn(@Request() req) {
        return this.accountService.signIn(req.user)
    }

}