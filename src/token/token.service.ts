import {Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TokenModel} from "./model/token.model";
import {UserModel} from "../user/model/user.model";
import {Payload} from "./interface/payload.interface";
import {JwtService} from "@nestjs/jwt";
import {Token} from "./interface/token.interface";
import * as bcrypt from 'bcrypt'
import {Op, UniqueConstraintError} from "sequelize";

@Injectable()
export class TokenService {

    constructor(
        @InjectModel(TokenModel)
        private tokenModel: typeof TokenModel,
        private jwtService: JwtService
    ) {
    }

    async findAll(): Promise<TokenModel[]> {
        try {
            const re = await this.tokenModel.update({value: 'zxc'}, {where: {id: 'eb48ad52-622d-4eb8-84ed-2722ac7e2fb2'}})
            console.log(re[0])
        } catch (error) {
            console.log(error)
        }
        return await this.tokenModel.findAll()
    }

    async create(token: string, user: string) {

        const value = await this.hash(token)
        const expiresIn = new Date(Date.now() + eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000)

        try {

            await this.removeExpired()
            return await this.tokenModel.create({value, user, expiresIn})

        } catch (error) {

            if (error instanceof UniqueConstraintError) {
                throw new InternalServerErrorException('Токен уже используется')
            }

            throw new InternalServerErrorException('Ошибка при создании токена')

        }

    }

    async update(oldToken, newToken, user) {

        const oldValue = await this.hash(oldToken)
        const tokenModel = await this.tokenModel.findOne({
            where: {
                value: oldValue,
                user
            }
        })

        if (!tokenModel) {
            throw new UnauthorizedException('Токен не найден')
        }

        tokenModel.value = await this.hash(newToken)

        return tokenModel.save()

    }

    async removeExpired(): Promise<number> {

        const total = await this.tokenModel.destroy({
            where: {
                expiresIn: {
                    [Op.lt]: new Date()
                }
            }
        })

        if (total) console.log(`Удалено токенов: ${total}`)

        return total

    }

    async hash(value: string): Promise<string> {

        const rounds = Number(process.env.BCRYPT_REFRESH_TOKEN_SALT_ROUNDS)
        const salt = await bcrypt.genSalt(rounds)

        return await bcrypt.hash(value, salt)

    }

    generate(userModel: UserModel): Token {

        const payload: Payload = {
            id: userModel.id,
            permissions: userModel.permissions.map(permission => permission.value)
        }

        const access = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: `${eval(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`
        })

        const refresh = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: `${eval(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME)}s`
        })

        return {access, refresh}

    }

}
