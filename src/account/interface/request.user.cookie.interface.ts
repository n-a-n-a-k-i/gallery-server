import {Request} from "express";
import {Payload} from "../../refresh.token/interface/payload.interface";
import {CookieRefreshToken} from "./cookie.refresh.token.interface";

export interface RequestUserCookie extends Request {
    user: Payload
    cookies: CookieRefreshToken
}