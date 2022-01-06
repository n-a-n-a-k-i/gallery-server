import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {Token} from "./interface/token.interface";
import {RefreshTokenService} from "../refresh.token/refresh.token.service";
import {UserModel} from "../user/model/user.model";
import {JwtService} from "@nestjs/jwt";
import {User} from "./interface/user.interface";

@Injectable()
export class AccountService {

    constructor(
        private userService: UserService,
        private refreshTokenService: RefreshTokenService,
        private jwtService: JwtService
    ) {}

    async signIn(user: User, host: string, userAgent: string): Promise<Token> {

        const token = this.generateToken(user)

        await this.refreshTokenService.create(user.id, token.refreshToken, host, userAgent)

        return token

    }

    async refresh(id: string, refreshToken: string, host: string, userAgent: string): Promise<Token> {

        const userModel = await this.userService.findById(id)
        const user = this.generateUser(userModel)
        const token = this.generateToken(user)

        await this.refreshTokenService.updateRefreshToken(refreshToken, token.refreshToken, host, userAgent)

        return token

    }

    async signOut(refreshToken: string): Promise<void> {

        await this.refreshTokenService.removeByRefreshToken(refreshToken)
        await this.refreshTokenService.removeExpired()

    }

    generateUser(userModel: UserModel): User {
        return {
            id: userModel.id,
            permissions: userModel.permissions.map(permission => permission.value)
        }
    }

    generateToken(user: User): Token {

        const accessToken = this.jwtService.sign(user, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: eval(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN)
        })

        const refreshToken = this.jwtService.sign(user, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: eval(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN)
        })

        return {accessToken, refreshToken}

    }

}
