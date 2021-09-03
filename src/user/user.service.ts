import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {UserModel} from "./model/user.model";
import {InjectModel} from "@nestjs/sequelize";
import {UserUpdateDto} from "./dto/user.update.dto";
import {UserUpdatePasswordDto} from "./dto/user.update.password.dto";
import {UserSignUpDto} from "./dto/user.sign.up.dto";
import {UserPublicDto} from "./dto/user.public.dto";
import {UserCreateDto} from "./dto/user.create.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel
    ) {}

    async signUp(userSignUpDto: UserSignUpDto): Promise<UserPublicDto> {
        const userModel = await this.userModel.create(userSignUpDto)
        return new UserPublicDto(userModel)
    }

    async create(userCreateDto: UserCreateDto): Promise<UserPublicDto> {
        const userModel = await this.userModel.create(userCreateDto)
        return new UserPublicDto(userModel)
    }

    async findAll(): Promise<UserPublicDto[]> {
        const userModels = await this.userModel.findAll()
        return userModels.map(userModel => new UserPublicDto(userModel))
    }

    async findOne(id: string): Promise<UserPublicDto> {
        const userModel = await this.userModel.findByPk(id)
        return new UserPublicDto(userModel)
    }

    async update(id: string, userUpdateDto: UserUpdateDto): Promise<UserPublicDto> {
        await this.userModel.update(userUpdateDto, {where: {id}})
        return await this.findOne(id)
    }

    async updatePassword(id: string, userUpdatePasswordDto: UserUpdatePasswordDto): Promise<UserPublicDto> {
        if (userUpdatePasswordDto.newPassword !== userUpdatePasswordDto.newPasswordAgain) {
            throw new BadRequestException()
        }
        const userModel = await this.userModel.findByPk(id)
        if (!userModel) {
            throw new NotFoundException()
        }
        if (userModel.password !== userUpdatePasswordDto.oldPassword) {
            throw new BadRequestException()
        }
        await this.userModel.update({password: userUpdatePasswordDto.newPassword}, {where: {id}})
        return await this.findOne(id)
    }

    async remove(id: string): Promise<UserPublicDto> {
        const userPublicDto = await this.findOne(id)
        await this.userModel.destroy({where: {id}})
        return userPublicDto
    }

}
