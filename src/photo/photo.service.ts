import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {Op, where, fn, col, WhereOptions} from "sequelize";
import {FindAllDto} from "./dto/find.all.dto";
import {FindTotalDto} from "./dto/find.total.dto";
import {FindTotalDatePartDto} from "./dto/find.total.date.part.dto";
import {TotalDatePartDto} from "./dto/total.date.part.dto";
import {UserService} from "../user/user.service";

@Injectable()
export class PhotoService {

    constructor(
        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel,
        private userService: UserService
    ) {
    }

    async findAll(photoFindAllDto: FindAllDto): Promise<PhotoModel[]> {

        const {orderColumn, orderDirection, limit, offset} = photoFindAllDto

        return await this.photoModel.findAll({
            attributes: {
                exclude: ['thumbnail', 'preview']
            },
            where: this.getWhereOptions(photoFindAllDto),
            order: [
                [orderColumn, orderDirection],
                'id'
            ],
            limit: limit,
            offset: offset
        })

    }

    async findTotal(photoFindTotalDto: FindTotalDto): Promise<number> {

        return await this.photoModel.count({
            where: this.getWhereOptions(photoFindTotalDto)
        })

    }

    async findTotalDatePart(findTotalDatePartDto: FindTotalDatePartDto): Promise<TotalDatePartDto[]> {

        const {datePart} = findTotalDatePartDto
        const photoModels = await this.photoModel.findAll({
            attributes: [
                [fn('distinct', fn('date_part', datePart, col('dateCreate'))), 'value'],
                [fn('count', col('id')), 'total']
            ],
            group: fn('date_part', datePart, col('dateCreate')),
            order: [
                col('value')
            ]
        })

        return photoModels.map(photoModel => new TotalDatePartDto(photoModel))

    }

    async findThumbnail(id: string): Promise<Buffer> {

        const photoModel: PhotoModel = await this.photoModel.findByPk(id, {
            attributes: {
                exclude: ['id', 'hash', 'dateCreate', 'dateImport', 'preview', 'user']
            }
        })

        if (!photoModel) {
            throw new NotFoundException('Фотография не найдена')
        }

        return photoModel.thumbnail

    }

    async findPreview(id: string): Promise<Buffer> {

        const photoModel: PhotoModel = await this.photoModel.findByPk(id, {
            attributes: {
                exclude: ['id', 'hash', 'dateCreate', 'dateImport', 'thumbnail', 'user']
            }
        })

        if (!photoModel) {
            throw new NotFoundException('Фотография не найдена')
        }

        return photoModel.preview

    }

    async findDateCreate(id: string): Promise<Date> {

        const photoModel: PhotoModel = await this.photoModel.findByPk(id, {
            attributes: {
                exclude: ['id', 'hash', 'dateImport', 'thumbnail', 'preview', 'user']
            }
        })

        if (!photoModel) {
            throw new NotFoundException('Фотография не найдена')
        }

        return photoModel.dateCreate

    }

    getWhereOptions(photoFindTotalDto: FindTotalDto): WhereOptions {

        const conditions: WhereOptions[] = [];

        ['year', 'month', 'day'].forEach(datePart => {

            const values = photoFindTotalDto[datePart + 's']

            if (values.length) {

                conditions.push(
                    where(fn('date_part', datePart, col('dateCreate')), {
                        [Op.in]: values
                    })
                )

            }

        })

        return {
            [Op.and]: conditions
        }

    }

    numberToString(number: number, size: number, char: string = '0'): string {

        let result = number.toString()

        while (result.length < size) result = char + result

        return result

    }

    async getFullFilePath(id: string): Promise<string> {

        const dateCreate = await this.findDateCreate(id)
        const {cloudUsername, cloudDirSync} = await this.userService.findById(process.env.NEXTCLOUD_OWNER)

        return process.env.NEXTCLOUD_PHOTO
            .split('{username}').join(cloudUsername)
            .split('{dirSync}').join(cloudDirSync)
            .split('{year}').join(dateCreate.getFullYear().toString())
            .split('{month}').join(this.numberToString(dateCreate.getMonth() + 1, 2))
            .split('{day}').join(this.numberToString(dateCreate.getDate(), 2))
            .split('{hours}').join(this.numberToString(dateCreate.getHours(), 2))
            .split('{minutes}').join(this.numberToString(dateCreate.getMinutes(), 2))
            .split('{seconds}').join(this.numberToString(dateCreate.getSeconds(), 2))
            .split('{id}').join(id)

    }

}
