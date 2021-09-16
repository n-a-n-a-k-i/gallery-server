import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AccountService} from "../account.service";
import {Injectable} from "@nestjs/common";
import {UserModel} from "../../user/model/user.model";
import {AccountSignInRequestDto} from "../dto/account.sign.in.request.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private accountService: AccountService) {
        super();
    }

    async validate(username: string, password: string): Promise<UserModel> {
        const accountSignInRequestDto = new AccountSignInRequestDto(username, password)
        return await this.accountService.validate(accountSignInRequestDto)
    }

}