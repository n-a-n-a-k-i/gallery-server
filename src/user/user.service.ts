import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {UserModel} from "./model/user.model";
import {InjectModel} from "@nestjs/sequelize";
import {UserCreateDto} from "./dto/user.create.dto";
import * as bcrypt from 'bcrypt'
import {UniqueConstraintError} from "sequelize";
import {PermissionModel} from "../permission/model/permission.model";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel
    ) {}

    async create(userCreateDto: UserCreateDto): Promise<UserModel> {

        const password = await this.hashPassword(userCreateDto.password)

        try {

            return await this.userModel.create({...userCreateDto, password})

        } catch (error) {

            if (error instanceof UniqueConstraintError) {
                throw new BadRequestException('Имя пользователя занято')
            }

            throw new InternalServerErrorException('Ошибка при создании пользователя')

        }

    }

    async findAll(): Promise<UserModel[]> {
        return await this.userModel.findAll({
            include: [{
                model: PermissionModel
            }]
        })
    }

    async findById(id: string): Promise<UserModel> {

        return await this.userModel.findByPk(id, {
            include: [{
                model: PermissionModel
            }]
        })

    }

    async findByUsername(username: string): Promise<UserModel> {

        return await this.userModel.findOne({
            where: {username},
            include: [{
                model: PermissionModel
            }]
        })

    }

    async hashPassword(password: string): Promise<string> {

        const rounds = Number(process.env.BCRYPT_PASSWORD_SALT_ROUNDS)
        const salt = await bcrypt.genSalt(rounds)

        return await bcrypt.hash(password, salt)

    }

}
