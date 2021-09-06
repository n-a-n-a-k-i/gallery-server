import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserModel} from "./model/user.model";
import {InjectModel} from "@nestjs/sequelize";
import {UserDto} from "./dto/user.dto";
import {UserCreateDto} from "./dto/user.create.dto";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel
    ) {}

    async create(userCreateDto: UserCreateDto): Promise<UserDto> {

        const {username, password} = userCreateDto
        const candidate = await this.userModel.findOne({where: {username}})

        if (candidate) {
            throw new HttpException('Пользователь с таким username уже существует', HttpStatus.BAD_REQUEST)
        }

        const hashPassword = await bcrypt.hash(password, 5)

        const userModel = await this.userModel.create({...userCreateDto, password: hashPassword})
        return new UserDto(userModel)
    }

    async findAll(): Promise<UserDto[]> {
        const userModels = await this.userModel.findAll()
        return userModels.map(userModel => new UserDto(userModel))
    }

    async findOne(id: string): Promise<UserDto> {
        const userModel = await this.userModel.findByPk(id)
        return new UserDto(userModel)
    }

}
