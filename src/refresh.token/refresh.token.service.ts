import {Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {UserModel} from "../user/model/user.model";
import {Payload} from "./interface/payload.interface";
import {JwtService} from "@nestjs/jwt";
import {Token} from "./interface/token.interface";
import {Op, UniqueConstraintError} from "sequelize";
import {RefreshTokenModel} from "./model/refresh.token.model";
import {createHash} from "crypto";

@Injectable()
export class RefreshTokenService {

    constructor(
        @InjectModel(RefreshTokenModel)
        private refreshTokenModel: typeof RefreshTokenModel,
        private jwtService: JwtService
    ) {
    }

    async findAll(): Promise<RefreshTokenModel[]> {
        return await this.refreshTokenModel.findAll()
    }

    async findByRefreshToken(refreshToken: string): Promise<RefreshTokenModel> {

        const value = this.hashRefreshToken(refreshToken)

        return await this.refreshTokenModel.findOne({
            where: {value}
        })

    }

    async create(refreshToken: string, user: string): Promise<RefreshTokenModel> {

        const value = this.hashRefreshToken(refreshToken)
        const expiresIn = this.generateExpiresIn()

        try {

            return await this.refreshTokenModel.create({value, user, expiresIn})

        } catch (error) {

            if (error instanceof UniqueConstraintError) {
                throw new InternalServerErrorException('Токен обновления уже используется')
            }

            throw new InternalServerErrorException('Ошибка при создании токена обновления')

        }

    }

    async update(oldRefreshToken, newRefreshToken): Promise<RefreshTokenModel> {

        const refreshTokenModel = await this.findByRefreshToken(oldRefreshToken)

        if (!refreshTokenModel) {
            throw new UnauthorizedException('Токен не найден')
        }

        refreshTokenModel.value = this.hashRefreshToken(newRefreshToken)
        refreshTokenModel.expiresIn = this.generateExpiresIn()

        return refreshTokenModel.save()

    }

    async removeExpired(): Promise<number> {

        const total = await this.refreshTokenModel.destroy({
            where: {
                expiresIn: {
                    [Op.lt]: new Date()
                }
            }
        })

        if (total) console.log(`Удалено токенов: ${total}`)

        return total

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

    generateExpiresIn(): Date {

        const seconds: number = eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME)
        const milliseconds = seconds * 1000
        const timestamp = Date.now() + milliseconds

        return new Date(timestamp)

    }

    hashRefreshToken(refreshToken: string): string {

        const algorithm = process.env.CRYPTO_REFRESH_TOKEN_ALGORITHM
        const hash = createHash(algorithm).update(refreshToken)

        return hash.digest('hex')

    }

}
