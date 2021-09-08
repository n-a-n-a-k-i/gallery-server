import {BadRequestException, Injectable} from '@nestjs/common';
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
    ) {
    }

    async create(userCreateDto: UserCreateDto): Promise<UserDto> {

        const {username, password} = userCreateDto
        const candidate = await this.userModel.findOne({where: {username}})

        if (candidate) {
            throw new BadRequestException('Пользователь с таким username уже существует')
        }

        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS))
        const hash = await bcrypt.hash(password, salt)
        const userModel = await this.userModel.create({...userCreateDto, password: hash})

        return new UserDto(userModel)
    }

    async findAll(): Promise<UserDto[]> {
        const userModels = await this.userModel.findAll()
        return userModels.map(userModel => new UserDto(userModel))
    }

    async findByUsername(username: string): Promise<UserModel | undefined> {
        return this.userModel.findOne({where: {username}})
    }

}
