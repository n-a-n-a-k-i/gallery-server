import {Request} from "express";

export interface Payload {
    id: string
    permissions: string[]
}

export interface RequestWithUser extends Request {
    user: Payload
}

export interface CookieRefreshToken {
    refreshToken: string
}

export interface RequestWithCookieRefreshToken extends Request {
    cookies: CookieRefreshToken
}

export interface RequestWithUserAndCookieRefreshToken extends Request {
    user: Payload
    cookies: CookieRefreshToken
}