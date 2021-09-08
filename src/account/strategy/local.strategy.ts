import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AccountService} from "../account.service";
import {Injectable, UnauthorizedException} from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private accountService: AccountService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {

        const userModel = await this.accountService.validateUser(username, password)

        if (!username) {
            throw new UnauthorizedException()
        }

        return userModel

    }

}