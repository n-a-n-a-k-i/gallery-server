import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../../user/user.service";
import * as bcrypt from 'bcrypt'
import {Payload} from "../../token/interface/payload.interface";
import {TokenService} from "../../token/token.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

    constructor(
        private userService: UserService,
        private tokenService: TokenService
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<Payload> {

        const userModel = await this.userService.findByUsername(username)
        const success = await bcrypt.compare(password, userModel.password)

        if (!success) {
            throw new UnauthorizedException('Не верный пароль')
        }

        return this.tokenService.generatePayload(userModel)

    }

}