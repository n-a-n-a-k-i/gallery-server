import {Permission} from "../../permission/enum/permission.enum";

export interface User {
    id: string
    permissions: Permission[]
}
