import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserCreateDto} from "./dto/user.create.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserModel} from "./model/user.model";

@ApiTags('Пользователь')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({type: UserModel})
    @Post()
    create(@Body() userCreateDto: UserCreateDto) {
        return this.userService.create(userCreateDto)
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({type: [UserModel]})
    @Get()
    findAll() {
        return this.userService.findAll()
    }

}
