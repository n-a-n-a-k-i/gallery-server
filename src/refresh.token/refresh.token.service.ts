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

    async create(user: string, refreshToken: string, host: string, userAgent: string): Promise<RefreshTokenModel> {

        const value = this.hashRefreshToken(refreshToken)
        const expiredAt = this.generateExpiredAt()

        try {

            return await this.refreshTokenModel.create({user, value, expiredAt, host, userAgent})

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

    async updateRefreshToken(refreshTokenOld, refreshToken, host, userAgent): Promise<RefreshTokenModel> {

        const refreshTokenModel = await this.findByRefreshToken(refreshTokenOld)

        if (!refreshTokenModel) {
            throw new UnauthorizedException('Токен не найден')
        }

        refreshTokenModel.value = this.hashRefreshToken(refreshToken)
        refreshTokenModel.expiredAt = this.generateExpiredAt()
        refreshTokenModel.host = host
        refreshTokenModel.userAgent = userAgent

        return refreshTokenModel.save()

    }

    async removeByRefreshToken(refreshToken: string): Promise<void> {

        const value = this.hashRefreshToken(refreshToken)

        await this.refreshTokenModel.destroy({
            where: {value}
        })

    }

    async removeExpired(): Promise<number> {

        const total = await this.refreshTokenModel.destroy({
            where: {
                expiredAt: {
                    [Op.lt]: new Date()
                }
            }
        })

        if (total) console.log(`Удалено токенов: ${total}`)

        return total

    }

    generateExpiredAt(): Date {

        const expiresIn: number = eval(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN)
        const expiredAt = Date.now() + expiresIn

        return new Date(expiredAt)

    }

    hashRefreshToken(refreshToken: string): string {

        const algorithm = process.env.CRYPTO_REFRESH_TOKEN_ALGORITHM
        const hash = createHash(algorithm).update(refreshToken)

        return hash.digest('hex')

    }

}
