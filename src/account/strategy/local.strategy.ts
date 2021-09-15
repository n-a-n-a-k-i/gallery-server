import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AccountService} from "../account.service";
import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {UserModel} from "../../user/model/user.model";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private accountService: AccountService) {
        super();
    }

    /**
     * Проверка имени пользователя и пароля происходит отдельно, так как:
     * 1. Исключение пробрасывается на уровне стратегии, а не сервиса.
     * 2. Необходимо определить вид исключения.
     */
    async validate(username: string, password: string): Promise<UserModel> {

        const userModel = await this.accountService.findUser(username)

        if (!userModel) {
            throw new BadRequestException('Пользователь не найден')
        }

        const success = await this.accountService.validatePassword(password, userModel)

        if (!success) {
            throw new UnauthorizedException('Не верный пароль')
        }

        return userModel

    }

}