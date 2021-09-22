import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {TokenService} from "../token/token.service";
import {Token} from "../token/interface/token.interface";
import {Payload} from "../token/interface/payload.interface";

@Injectable()
export class AccountService {

    constructor(
        private userService: UserService,
        private tokenService: TokenService
    ) {
    }

    async signIn(payload: Payload): Promise<Token> {
        const token = this.tokenService.generateToken(payload)
        await this.tokenService.create(token.refresh, payload.id)
        return token
    }

}
