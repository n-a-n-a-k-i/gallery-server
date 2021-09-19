import {UserModel} from "../../user/model/user.model";

export interface RequestWithUser extends Request {
    user: UserModel
}