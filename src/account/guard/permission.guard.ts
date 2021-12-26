import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {Permission} from "../enum/permission.enum";
import {PERMISSION_KEY} from "../decorator/permissions.decorator";
import {RequestWithUser} from "../interface/request.with.user.interface";

@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const permissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!permissions) {
            return true
        }

        const {user} = context.switchToHttp().getRequest<RequestWithUser>()
        const success = permissions.some(permission => user.permissions.includes(permission))

        if (!success) {
            throw new ForbiddenException(`Недостаточно прав: ${permissions.join()}`)
        }

        return success

    }

}
