import {Request} from "express";
import {User} from "./user.interface";
import {CookieRefreshToken} from "./cookie-refresh-token.interface";

export interface RequestWithUserAndCookieRefreshToken extends Request {
    user: User
    cookies: CookieRefreshToken
}
