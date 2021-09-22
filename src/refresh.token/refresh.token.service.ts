import {Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op, UniqueConstraintError} from "sequelize";
import {RefreshTokenModel} from "./model/refresh.token.model";
import {createHash} from "crypto";

@Injectable()
export class RefreshTokenService {

    constructor(
        @InjectModel(RefreshTokenModel)
        private refreshTokenModel: typeof RefreshTokenModel
    ) {
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

    async findByUser(user): Promise<RefreshTokenModel[]> {
        return await this.refreshTokenModel.findAll({
            where: {user}
        })
    }

    async findByRefreshToken(refreshToken: string): Promise<RefreshTokenModel> {

        const value = this.hashRefreshToken(refreshToken)

        return await this.refreshTokenModel.findOne({
            where: {value}
        })

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
