import {Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {JsonWebTokenError, NotBeforeError, TokenExpiredError} from "jsonwebtoken";

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwt-refresh-token') {

    handleRequest(err: any, user: any, info: any, context: any, status: any) {

        if (info instanceof TokenExpiredError) {
            throw new UnauthorizedException('Срок действия токена обновления истёк')
        }

        if (info instanceof NotBeforeError) {
            throw new UnauthorizedException('Текущее время отстаёт от начала действия токена обновления')
        }

        if (info instanceof JsonWebTokenError) {
            throw new UnauthorizedException('Недействительная подпись токена обновления')
        }

        if (info instanceof Error) {
            throw new UnauthorizedException('Отсутствует токен обновления')
        }

        return super.handleRequest(err, user, info, context, status);

    }

}
