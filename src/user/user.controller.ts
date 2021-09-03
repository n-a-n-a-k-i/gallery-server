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

    @ApiOperation({summary: 'Региистрация пользователя'})
    @ApiResponse({type: UserPublicDto})
    @Post('/signup')
    create(@Body() userSignUpDto: UserSignUpDto): Promise<UserPublicDto> {
        return this.userService.signUp(userSignUpDto)
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({type: [UserModel]})
    @Get()
    findAll() {
        return this.userService.findAll()
    }

}
