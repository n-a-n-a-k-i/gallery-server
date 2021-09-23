import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {IS_PUBLIC_KEY} from "../decorator/public.decorator";
import {JsonWebTokenError, NotBeforeError, TokenExpiredError} from "jsonwebtoken";

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt-access-token') {

    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) {
            return true
        }

        return super.canActivate(context)

    }

    handleRequest(err: any, user: any, info: any, context: any, status: any) {

        if (info instanceof TokenExpiredError) {
            throw new UnauthorizedException('Срок действия токена доступа истёк')
        }

        if (info instanceof NotBeforeError) {
            throw new UnauthorizedException('Текущее время отстаёт от начала действия токена доступа')
        }

        if (info instanceof JsonWebTokenError) {
            throw new UnauthorizedException('Недействительная подпись токена доступа')
        }

        if (info instanceof Error) {
            throw new UnauthorizedException('Отсутствует токен доступа')
        }

        return super.handleRequest(err, user, info, context, status);

    }

}