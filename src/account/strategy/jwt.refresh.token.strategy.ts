import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Payload} from "../../token/interface/payload.interface";
import {Request} from "express";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request?.cookies?.token]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET
        });
    }

    async validate(payload: Payload): Promise<Payload> {
        return payload
    }

}
