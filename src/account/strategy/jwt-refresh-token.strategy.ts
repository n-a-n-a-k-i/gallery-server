import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {RefreshTokenService} from "../../refresh-token/refresh-token.service";
import {RequestWithCookieRefreshToken} from "../interface/request-with-cookie-refresh-token.interface";
import {RequestWithUserAndCookieRefreshToken} from "../interface/request-with-user-and-cookie-refresh-token.interface";
import {User} from "../interface/user.interface";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {

    constructor(
        private refreshTokenService: RefreshTokenService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: RequestWithCookieRefreshToken) => request.cookies?.refreshToken
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
            passReqToCallback: true
        });
    }

    async validate(request: RequestWithUserAndCookieRefreshToken, user: User): Promise<User> {

        const refreshToken = request.cookies.refreshToken
        const tokenModel = await this.refreshTokenService.findByRefreshToken(refreshToken)

        if (!tokenModel) {
            console.log(`Токен обновления не найден: ${refreshToken}`)
            throw new UnauthorizedException('Токен обновления не найден')
        }

        return user

    }



}
