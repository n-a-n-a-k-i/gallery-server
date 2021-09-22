import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../../user/user.service";
import * as bcrypt from 'bcrypt'
import {AccountService} from "../account.service";
import {Payload} from "../interface/request.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

    constructor(
        private userService: UserService,
        private accountService: AccountService
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<Payload> {

        const userModel = await this.userService.findByUsername(username)

        if (!userModel) {
            console.log(`Пользователь не найден: ${username}`)
            throw new UnauthorizedException('Неверное имя пользователя или пароль')
        }

        const success = await bcrypt.compare(password, userModel.password)

        if (!success) {
            console.log(`Не верный пароль: ${username}`)
            throw new UnauthorizedException('Неверное имя пользователя или пароль')
        }

        return this.accountService.generatePayload(userModel)

    }

}