import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TokenModel} from "./model/token.model";

@Injectable()
export class TokenService {

    constructor(
        @InjectModel(TokenModel)
        private tokenModel: typeof TokenModel
    ) {
    }

    async findAll(): Promise<TokenModel[]> {
        return await this.tokenModel.findAll()
    }

}
