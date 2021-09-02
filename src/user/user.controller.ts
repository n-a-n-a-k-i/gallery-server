import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserModel} from "./model/user.model";
import {UserPublicDto} from "./dto/user.public.dto";
import {UserSignUpDto} from "./dto/user.sign.up.dto";

@ApiTags('Пользователь')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({type: UserPublicDto})
    @Post()
    create(@Body() userSignUpDto: UserSignUpDto) {
        return this.userService.signUp(userSignUpDto)
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({type: [UserModel]})
    @Get()
    findAll() {
        return this.userService.findAll()
    }

}
