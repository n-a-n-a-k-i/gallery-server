import {Request} from "express";
import {Payload} from "../../refresh.token/interface/payload.interface";

export interface RequestUser extends Request {
    user: Payload
}