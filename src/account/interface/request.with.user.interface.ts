import {Request} from "express";
import {Payload} from "../../token/interface/payload.interface";

export interface RequestWithUser extends Request {
    user: Payload
}