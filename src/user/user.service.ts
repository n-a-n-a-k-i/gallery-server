import {Injectable} from '@nestjs/common';
import {UserModel} from "./model/user.model";
import {InjectModel} from "@nestjs/sequelize";
import {UserCreateDto} from "./dto/user.create.dto";
import {UserUpdateDto} from "./dto/user.update.dto";
import {UserPasswordDto} from "./dto/user.password.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel
    ) {}

    async create(userCreateDto: UserCreateDto): Promise<UserModel> {
        const user = await this.userModel.create(userCreateDto)
        return await this.findOne(user.id)
    }

    async findAll(): Promise<UserModel[]> {
        return await this.userModel.findAll({attributes: {exclude: ['password']}})
    }

    async findOne(id: string): Promise<UserModel> {
        return await this.userModel.findByPk(id,{attributes: {exclude: ['password']}})
    }

    async update(id: string, userUpdateDto: UserUpdateDto): Promise<UserModel> {
        await this.userModel.update(userUpdateDto, {where: {id}})
        return await this.findOne(id)
    }

    async updatePassword(id: string, userPasswordDto: UserPasswordDto): Promise<UserModel> {
        await this.userModel.update(userPasswordDto, {where: {id}})
        return await this.findOne(id)
    }

    async remove(id: string): Promise<UserModel> {
        const user = await this.findOne(id)
        await this.userModel.destroy({where: {id}})
        return user
    }

}
