import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserDto} from "./dto/user.dto";
import {UserCreateDto} from "./dto/user.create.dto";
import {Permissions} from "../account/decorator/permissions.decorator";
import {Permission} from "../permission/enum/permission.enum";

@ApiTags('Пользователь')
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({type: UserDto})
    @ApiBody({type: UserCreateDto})
    @ApiBearerAuth('accessToken')
    @Permissions(Permission.USER_CREATE)
    @Post()
    async create(@Body() userCreateDto: UserCreateDto): Promise<UserDto> {
        const userModel = await this.userService.create(userCreateDto)
        return new UserDto(userModel)
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({type: [UserDto]})
    @ApiBearerAuth('accessToken')
    @Get()
    async findAll(): Promise<UserDto[]> {
        const userModels = await this.userService.findAll()
        return userModels.map(userModel => new UserDto(userModel))
    }

}
