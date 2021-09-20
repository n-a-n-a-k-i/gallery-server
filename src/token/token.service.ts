import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TokenModel} from "./model/token.model";
import {UserModel} from "../user/model/user.model";
import {Payload} from "./interface/payload.interface";
import {JwtService} from "@nestjs/jwt";
import {Token} from "./interface/token.interface";

@Injectable()
export class TokenService {

    constructor(
        @InjectModel(TokenModel)
        private tokenModel: typeof TokenModel,
        private jwtService: JwtService
    ) {
    }

    async findAll(): Promise<TokenModel[]> {
        return await this.tokenModel.findAll()
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
