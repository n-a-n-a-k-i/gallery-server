import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {UserModel} from "./model/user.model";
import {InjectModel} from "@nestjs/sequelize";
import {UserCreateDto} from "./dto/user.create.dto";
import * as bcrypt from 'bcrypt'
import {UniqueConstraintError} from "sequelize";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel
    ) {
    }

    async create(userCreateDto: UserCreateDto): Promise<UserModel> {

        const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);
        const salt = await bcrypt.genSalt(rounds)
        const password = await bcrypt.hash(userCreateDto.password, salt)

        try {

            return await this.userModel.create({...userCreateDto, password})

        } catch (error) {

            if (error instanceof UniqueConstraintError) {
                throw new BadRequestException('Имя пользователя занято')
            }

            throw new InternalServerErrorException('Что-то пошло не так')

        }

    }

    async findAll(): Promise<UserModel[]> {
        return await this.userModel.findAll({include: {all: true}})
    }

    async findByUsername(username: string): Promise<UserModel | undefined> {
        const userModel = await this.userModel.findOne({where: {username}, include: {all: true}})
        if (!userModel) {
            throw new NotFoundException('Пользователь не найден')
        }
        return userModel
    }

}
