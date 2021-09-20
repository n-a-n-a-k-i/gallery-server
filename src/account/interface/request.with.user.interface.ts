import {Request} from "express";
import {UserModel} from "../../user/model/user.model";

export interface RequestWithUser extends Request {
    user: UserModel
}