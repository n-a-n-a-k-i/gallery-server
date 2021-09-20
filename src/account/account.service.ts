import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt'
import {UserModel} from "../user/model/user.model";
import {AccountSignInResponseDto} from "./dto/account.sign.in.response.dto";
import {AccountSignInRequestDto} from "./dto/account.sign.in.request.dto";
import {TokenService} from "../token/token.service";

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

    async signIn(userModel: UserModel): Promise<AccountSignInResponseDto> {

        const token = this.tokenService.generate(userModel)

        return new AccountSignInResponseDto(token.access)

    }

}
