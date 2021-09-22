import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {Token} from "../refresh.token/interface/token.interface";
import {Payload} from "../refresh.token/interface/payload.interface";
import {RefreshTokenService} from "../refresh.token/refresh.token.service";

@Injectable()
export class AccountService {

    constructor(
        private userService: UserService,
        private refreshTokenService: RefreshTokenService
    ) {
    }

    async signIn(payload: Payload): Promise<Token> {

        const token = this.refreshTokenService.generateToken(payload)

        await this.refreshTokenService.create(token.refreshToken, payload.id)

        return token

    }

    async refresh(oldPayload: Payload, oldRefreshToken: string): Promise<Token> {

        const userModel = await this.userService.findById(oldPayload.id)
        const payload = this.refreshTokenService.generatePayload(userModel)
        const token = this.refreshTokenService.generateToken(payload)

        await this.refreshTokenService.update(oldRefreshToken, token.refreshToken)

        return token

    }

}
