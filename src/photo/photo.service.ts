import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {Op, where, fn, col, WhereOptions} from "sequelize";
import {PhotoFindAllDto} from "./dto/photo.find.all.dto";
import {PhotoFindTotalDto} from "./dto/photo.find.total.dto";
import {PhotoFindTotalDatePartDto} from "./dto/photo.find.total.date.part.dto";
import {PhotoTotalDatePartDto} from "./dto/photo.total.date.part.dto";

@Injectable()
export class PhotoService {

    constructor(
        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel
    ) {
    }

    async findAll(photoFindAllDto: PhotoFindAllDto): Promise<PhotoModel[]> {

        const datePartConditions = this.getDatePartConditions(photoFindAllDto)
        const {dateColumn, sortDirection, limit, offset} = photoFindAllDto

        return await this.photoModel.findAll({
            attributes: {
                exclude: ['thumbnail', 'preview']
            },
            where: {
                [Op.and]: datePartConditions
            },
            order: [
                [dateColumn, sortDirection],
                'id'
            ],
            limit: limit,
            offset: offset
        })

    }

    async findTotal(photoFindTotalDto: PhotoFindTotalDto): Promise<number> {

        const datePartConditions = this.getDatePartConditions(photoFindTotalDto)

        return await this.photoModel.count({
            where: {
                [Op.and]: datePartConditions
            }
        })

    }

    async findTotalDatePart(findTotalDatePartDto: PhotoFindTotalDatePartDto): Promise<PhotoTotalDatePartDto[]> {

        const {dateColumn, datePart} = findTotalDatePartDto
        const photoModels = await this.photoModel.findAll({
            attributes: [
                [fn('distinct', fn('date_part', datePart, col(dateColumn))), 'value'],
                [fn('count', col('id')), 'total']
            ],
            group: fn('date_part', datePart, col(dateColumn)),
            order: [
                col('value')
            ]
        })

        return photoModels.map(photoModel => new PhotoTotalDatePartDto(photoModel))

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

    getDatePartConditions(photoFindTotalDto: PhotoFindTotalDto): WhereOptions<WhereOptions>[] {

        const conditions = []
        const dateParts = ['year', 'month', 'day']

        dateParts.forEach(datePart => {

            const items = photoFindTotalDto[datePart + 's']

            if (items.length) conditions.push(
                where(
                    fn('date_part', datePart, col('dateCreate')),
                    {
                        [Op.in]: items
                    }
                )
            )

        })

        return conditions

    }

}
