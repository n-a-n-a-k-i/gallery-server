import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserDto} from "./dto/user.dto";
import {UserCreateDto} from "./dto/user.create.dto";

@ApiTags('Пользователь')
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({type: UserDto})
    @Post()
    create(@Body() userCreateDto: UserCreateDto): Promise<UserDto> {
        return this.userService.create(userCreateDto)
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({type: [UserDto]})
    @Get()
    findAll(): Promise<UserDto[]> {
        return this.userService.findAll()
    }

}
