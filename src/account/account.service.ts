import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {Token} from "./interface/token.interface";
import {RefreshTokenService} from "../refresh-token/refresh-token.service";
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

    /**
     * Вход
     * @param user
     * @param host
     * @param userAgent
     */
    async signIn(user: User, host: string, userAgent: string): Promise<Token> {

        const token = this.getToken(user)

        await this.refreshTokenService.create(user.id, token.refreshToken, host, userAgent)

        return token

    }

    /**
     * Обновление токенов
     * @param id
     * @param refreshToken
     * @param host
     * @param userAgent
     */
    async refresh(id: string, refreshToken: string, host: string, userAgent: string): Promise<Token> {

        const userModel = await this.userService.findById(id)
        const user = this.getUser(userModel)
        const token = this.getToken(user)

        await this.refreshTokenService.updateRefreshToken(refreshToken, token.refreshToken, host, userAgent)

        return token

    }

    /**
     * Выход
     * @param refreshToken
     */
    async signOut(refreshToken: string): Promise<void> {

        await this.refreshTokenService.removeByRefreshToken(refreshToken)
        await this.refreshTokenService.removeExpired()

    }

    /**
     * Генерация пользователя
     * @param userModel
     */
    getUser(userModel: UserModel): User {
        return {
            id: userModel.id,
            permissions: userModel.permissions.map(permission => permission.value)
        }
    }

    /**
     * Генерация токенов
     * @param user
     */
    getToken(user: User): Token {

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
