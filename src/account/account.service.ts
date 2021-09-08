import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcryptjs'
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AccountService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {
    }

    async validateUser(username: string, password: string): Promise<any> {

        const userModel = await this.userService.findByUsername(username)

        if (!userModel) {
            return null
        }

        const isPasswordEquals = await bcrypt.compare(password, userModel.password)

        if (!isPasswordEquals) {
            return null
        }

        return userModel

        // if (!userModel) {
        //     new NotFoundException('Пользователь не найден')
        // }
        //
        // const isPasswordEquals = await bcrypt.compare(userModel.password, password)
        //
        // if (!isPasswordEquals) {
        //     new UnauthorizedException('Не верный пароль')
        // }
        //
        // const payload = {id: userModel.id}
        // return userModel

    }

    async signIn(user: any) {

        const payload = {sub: user.id}
        return {
            access_token: this.jwtService.sign(payload)
        }

    }

}
