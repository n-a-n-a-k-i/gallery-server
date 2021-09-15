import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcryptjs'
import {JwtService} from "@nestjs/jwt";
import {UserModel} from "../user/model/user.model";
import {AccountSignInResponseDto} from "./dto/account.sign.in.response.dto";

@Injectable()
export class AccountService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {
    }

    async findUser(username: string): Promise<UserModel | null> {

        return await this.userService.findByUsername(username)

    }

    async validatePassword(password: string, userModel: UserModel): Promise<boolean> {

        return await bcrypt.compare(password, userModel.password)

    }

    async signIn(userModel: UserModel): Promise<AccountSignInResponseDto> {

        const payload = {sub: userModel.id}
        const token = this.jwtService.sign(payload)

        return new AccountSignInResponseDto(token)

    }

}
