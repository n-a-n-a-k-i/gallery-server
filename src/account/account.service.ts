import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt'
import {UserModel} from "../user/model/user.model";
import {AccountSignInRequestDto} from "./dto/account.sign.in.request.dto";
import {TokenService} from "../token/token.service";
import {Token} from "../token/interface/token.interface";

@Injectable()
export class AccountService {

    constructor(
        private userService: UserService,
        private tokenService: TokenService
    ) {
    }

    async validate(accountSignInRequestDto: AccountSignInRequestDto): Promise<UserModel> {

        const userModel = await this.userService.findByUsername(accountSignInRequestDto.username)
        const success = await bcrypt.compare(accountSignInRequestDto.password, userModel.password)

        if (!success) {
            throw new UnauthorizedException('Не верный пароль')
        }

        return userModel

    }

    async signIn(userModel: UserModel): Promise<Token> {
        return this.tokenService.generate(userModel)
    }

}
