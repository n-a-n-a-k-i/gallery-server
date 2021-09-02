import {Injectable} from '@nestjs/common';
import {UserModel} from "./model/user.model";
import {InjectModel} from "@nestjs/sequelize";
import {UserUpdateDto} from "./dto/user.update.dto";
import {UserUpdatePasswordDto} from "./dto/user.update.password.dto";
import {UserSignUpDto} from "./dto/user.sign.up.dto";
import {UserPublicDto} from "./dto/user.public.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel
    ) {}

    async signUp(userSignUpDto: UserSignUpDto): Promise<UserPublicDto> {
        const user = await this.userModel.create(userSignUpDto)
        return new UserPublicDto(user)
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

    async updatePassword(id: string, userPasswordDto: UserUpdatePasswordDto): Promise<UserModel> {
        await this.userModel.update(userPasswordDto, {where: {id}})
        return await this.findOne(id)
    }

    async remove(id: string): Promise<UserModel> {
        const user = await this.findOne(id)
        await this.userModel.destroy({where: {id}})
        return user
    }

}
