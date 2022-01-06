import {Controller, Get} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PermissionService} from "./permission.service";
import {PermissionDto} from "./dto/permission.dto";

@ApiTags('Разрешение')
@Controller('permission')
export class PermissionController {

    constructor(private readonly permissionService: PermissionService) {}

    @ApiOperation({summary: 'Поиск разрешений'})
    @ApiResponse({type: [PermissionDto]})
    @ApiBearerAuth('accessToken')
    @Get()
    async findAll(): Promise<PermissionDto[]> {
        const permissionModels = await this.permissionService.findAll()
        return permissionModels.map(permissionModel => new PermissionDto(permissionModel))
    }

}
