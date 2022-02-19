import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {UserModel} from "./model/user.model";
import {InjectModel} from "@nestjs/sequelize";
import {UserCreateDto} from "./dto/user-create.dto";
import * as bcrypt from 'bcrypt'
import {Op, UniqueConstraintError} from "sequelize";
import {PermissionModel} from "../permission/model/permission.model";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel
    ) {}

    /**
     * Создание пользователя
     * @param userCreateDto
     */
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

    /**
     * Поиск пользователей
     */
    async findAll(): Promise<UserModel[]> {
        return await this.userModel.findAll({
            include: [{
                model: PermissionModel
            }]
        })
    }

    /**
     * Поиск пользователей для синхронизации
     */
    async findSync(): Promise<UserModel[]> {
        return await this.userModel.findAll({
            where: {
                isSync: true,
                cloudUsername: {
                    [Op.not]: null
                },
                cloudPassword: {
                    [Op.not]: null
                },
                cloudPathScan: {
                    [Op.not]: null
                },
                cloudPathSync: {
                    [Op.not]: null
                }
            }
        })
    }

    /**
     * Поиск пользователей для очистки
     */
    async findClear(): Promise<UserModel[]> {
        return await this.userModel.findAll({
            where: {
                isClear: true,
                cloudUsername: {
                    [Op.not]: null
                },
                cloudPassword: {
                    [Op.not]: null
                },
                cloudPathScan: {
                    [Op.not]: null
                },
                cloudPathSync: {
                    [Op.not]: null
                }
            }
        })
    }

    /**
     * Поиск пользователя по идентификатору
     * @param id
     */
    async findById(id: string): Promise<UserModel> {

        return await this.userModel.findByPk(id, {
            include: [{
                model: PermissionModel
            }]
        })

    }

    /**
     * Поиск пользователя по имени пользователя
     * @param username
     */
    async findByUsername(username: string): Promise<UserModel> {

        return await this.userModel.findOne({
            where: {username},
            include: [{
                model: PermissionModel
            }]
        })

    }

    /**
     * Хеширование пароля
     * @param password
     */
    async hashPassword(password: string): Promise<string> {

        const rounds = Number(process.env.BCRYPT_PASSWORD_SALT_ROUNDS)
        const salt = await bcrypt.genSalt(rounds)

        return await bcrypt.hash(password, salt)

    }

}
