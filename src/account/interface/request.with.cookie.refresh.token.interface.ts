import {Request} from "express";
import {CookieRefreshToken} from "./cookie.refresh.token.interface";

export interface RequestWithCookieRefreshToken extends Request {
    cookies: CookieRefreshToken
}