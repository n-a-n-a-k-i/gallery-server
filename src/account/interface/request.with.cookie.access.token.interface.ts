import {Request} from 'express'
import {CookieAccessToken} from "./cookie.access.token.interface";

export interface RequestWithCookieAccessToken extends Request {
    cookies: CookieAccessToken
}