import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {User} from "../interface/user.interface";
import {RequestWithCookieAccessToken} from "../interface/request-with-cookie-access-token.interface";
import {Request} from "express";

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access-token') {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {

                    if (!request.headers.authorization) {
                        return null
                    }

                    const [type, accessToken] = request.headers.authorization.split(' ')

                    if (!type || type !== 'Bearer' || !accessToken) {
                        return null
                    }

                    return accessToken

                },
                (request: RequestWithCookieAccessToken) => {

                    const paths = [
                        '/photo/thumbnail/:id',
                        '/photo/preview/:id'
                    ]

                    if (!paths.includes(request.route.path)) {
                        return null
                    }

                    return request.cookies.accessToken

                }
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET
        });
    }

    async validate(user: User): Promise<User> {
        return user
    }

}
