import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {UserModel} from "./model/user.model";
import {InjectModel} from "@nestjs/sequelize";
import {UserCreateDto} from "./dto/user-create.dto";
import * as bcrypt from 'bcrypt'
import {Op, UniqueConstraintError} from "sequelize";
import {PermissionModel} from "../permission/model/permission.model";
import * as sharp from 'sharp'

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
    async find(): Promise<UserModel[]> {
        return await this.userModel.findAll({
            attributes: {
                exclude: ['avatar']
            },
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
            attributes: {
                exclude: ['avatar']
            },
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
            attributes: {
                exclude: ['avatar']
            },
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
            attributes: {
                exclude: ['avatar']
            },
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
            attributes: {
                exclude: ['avatar']
            },
            where: {username},
            include: [{
                model: PermissionModel
            }]
        })

    }

    /**
     * Поиск аватара
     * @param id
     */
    async findAvatar(id: string): Promise<Buffer> {

        const userModel: UserModel = await this.userModel.findByPk(id, {
            attributes: {
                exclude: [
                    'id',
                    'username',
                    'password',
                    // 'avatar',
                    'isSync',
                    'isClear',
                    'cloudUsername',
                    'cloudPassword',
                    'cloudPathScan',
                    'cloudPathSync',
                    'surname',
                    'name',
                    'patronymic',
                    'birthday',
                    'email',
                    'phone',
                    'createdAt',
                    'updatedAt'
                ]
            }
        })

        if (!userModel) {
            throw new NotFoundException('Пользователь не найден')
        }

        return userModel.avatar

    }

    /**
     * Обновление аватара
     * @param id
     * @param file
     */
    async updateAvatar(id: string, file: Buffer): Promise<Buffer> {

        try {

            const avatar: Buffer = await sharp(file).rotate().resize({
                width: 40,
                height: 40,
                fit: 'cover'
            }).jpeg().toBuffer()

            await this.userModel.update({avatar}, {where: {id}})

            return avatar

        } catch (error) {

            throw new InternalServerErrorException('Ошибка при обновлении аватара')

        }

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
