import {Request} from "express";
import {Payload} from "./payload.interface";

export interface RequestUser extends Request {
    user: Payload
}