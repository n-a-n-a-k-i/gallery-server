import {Body, Controller, Get, Param, ParseUUIDPipe, Post, Res, StreamableFile} from '@nestjs/common';
import {UserService} from "./user.service";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserDto} from "./dto/user.dto";
import {UserCreateDto} from "./dto/user-create.dto";
import {Permissions} from "../account/decorator/permissions.decorator";
import {Permission} from "../permission/enum/permission.enum";
import {Response} from "express";
import * as Buffer from "buffer";

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

    @ApiOperation({summary: 'Поиск пользователей'})
    @ApiResponse({type: [UserDto]})
    @ApiBearerAuth('accessToken')
    @Get()
    async find(): Promise<UserDto[]> {
        const userModels = await this.userService.find()
        return userModels.map(userModel => new UserDto(userModel))
    }

    @ApiOperation({summary: 'Поиск аватара'})
    @ApiResponse({type: StreamableFile})
    @ApiBearerAuth('accessToken')
    @Get('/avatar/:id')
    async findAvatar(
        @Res({passthrough: true}) response: Response,
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string
    ): Promise<StreamableFile> {

        const avatar: Buffer = await this.userService.findAvatar(id)

        response.contentType('image/jpeg')
        response.setHeader('Content-Disposition', `inline; filename="${id}.jpg"`)

        return new StreamableFile(avatar)

    }

}
