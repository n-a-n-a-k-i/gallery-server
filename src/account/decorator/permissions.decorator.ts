import {Permission} from "../../permission/enum/permission.enum";
import {SetMetadata} from "@nestjs/common";

export const PERMISSION_KEY = 'permission'
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSION_KEY, permissions)
