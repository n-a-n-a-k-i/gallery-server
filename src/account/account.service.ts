import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt'
import {JwtService} from "@nestjs/jwt";
import {UserModel} from "../user/model/user.model";
import {AccountSignInResponseDto} from "./dto/account.sign.in.response.dto";
import {AccountSignInRequestDto} from "./dto/account.sign.in.request.dto";

@Injectable()
export class AccountService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
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

        const permissions = userModel.permissions.map(permission => permission.value)
        const payload = {id: userModel.id, permissions}
        const token = this.jwtService.sign(payload)

        return new AccountSignInResponseDto(token)

    }

}
