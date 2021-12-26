import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {Token} from "./interface/token.interface";
import {RefreshTokenService} from "../refresh.token/refresh.token.service";
import {UserModel} from "../user/model/user.model";
import {JwtService} from "@nestjs/jwt";
import {Payload} from "./interface/payload.interface";

@Injectable()
export class AccountService {

    constructor(
        private userService: UserService,
        private refreshTokenService: RefreshTokenService,
        private jwtService: JwtService
    ) {
    }

    async findAccount(payload: Payload): Promise<UserModel> {

        return await this.userService.findById(payload.id)

    }

    async signIn(payload: Payload, host: string, userAgent: string): Promise<Token> {

        const token = this.generateToken(payload)

        await this.refreshTokenService.create(payload.id, token.refreshToken, host, userAgent)

        return token

    }

    async refresh(id: string, refreshToken: string, host: string, userAgent: string): Promise<Token> {

        const userModel = await this.userService.findById(id)
        const payload = this.generatePayload(userModel)
        const token = this.generateToken(payload)

        await this.refreshTokenService.updateRefreshToken(refreshToken, token.refreshToken, host, userAgent)

        return token

    }

    async signOut(refreshToken: string): Promise<void> {

        await this.refreshTokenService.removeByRefreshToken(refreshToken)
        await this.refreshTokenService.removeExpired()

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
            expiresIn: eval(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN)
        })

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: eval(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN)
        })

        return {accessToken, refreshToken}

    }

}
