import {BadRequestException, Injectable} from '@nestjs/common';
import {UserModel} from "./model/user.model";
import {InjectModel} from "@nestjs/sequelize";
import {UserCreateDto} from "./dto/user.create.dto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel
    ) {
    }

    async create(userCreateDto: UserCreateDto): Promise<UserModel> {

        const {username, password} = userCreateDto
        const userModel = await this.findByUsername(username)

        if (userModel) {
            throw new BadRequestException('Имя пользователя занято')
        }

        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS))
        const hash = await bcrypt.hash(password, salt)
        await this.userModel.create({...userCreateDto, password: hash})
        return this.findByUsername(username)

    }

    async findAll(): Promise<UserModel[]> {
        return await this.userModel.findAll({include: {all: true}})
    }

    async findByUsername(username: string): Promise<UserModel | undefined> {
        return this.userModel.findOne({where: {username}, include: {all: true}})
    }

}
