import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {Token} from "./interface/token.interface";
import {RefreshTokenService} from "../refresh.token/refresh.token.service";
import {UserModel} from "../user/model/user.model";
import {JwtService} from "@nestjs/jwt";
import {Payload} from "./interface/request.interface";

@Injectable()
export class AccountService {

    constructor(
        private userService: UserService,
        private refreshTokenService: RefreshTokenService,
        private jwtService: JwtService
    ) {
    }

    async signIn(payload: Payload): Promise<Token> {

        const token = this.generateToken(payload)

        await this.refreshTokenService.create(token.refreshToken, payload.id)

        return token

    }

    async refresh(oldPayload: Payload, oldRefreshToken: string): Promise<Token> {

        const userModel = await this.userService.findById(oldPayload.id)
        const payload = this.generatePayload(userModel)
        const token = this.generateToken(payload)

        await this.refreshTokenService.update(oldRefreshToken, token.refreshToken)

        return token

    }

    generatePayload(userModel: UserModel): Payload {
        return {
            id: userModel.id,
            permissions: userModel.permissions.map(permission => permission.value)
        }
    }

    generateToken(payload: Payload): Token {

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: `${eval(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`
        })

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: `${eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME)}s`
        })

        return {accessToken, refreshToken}

    }

}
