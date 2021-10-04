import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {Op, where, fn, col, WhereOptions} from "sequelize";
import {PhotoFindAllDto} from "./dto/photo.find.all.dto";
import {PhotoFindTotalDto} from "./dto/photo.find.total.dto";

@Injectable()
export class PhotoService {

    constructor(
        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel
    ) {
    }

    async findAll(photoFindAllDto: PhotoFindAllDto): Promise<PhotoModel[]> {

        const datePartConditions = this.getDatePartConditions(photoFindAllDto)
        const {timeStart, limit, sortColumn, sortDirection} = photoFindAllDto

        return await this.photoModel.findAll({
            attributes: {
                exclude: ['thumbnail', 'preview']
            },
            where: {
                [Op.and]: [
                    ...datePartConditions,
                    {
                        [sortColumn]: {
                            [sortDirection === 'ASC' ? Op.gt : Op.lt]: new Date(timeStart)
                        }
                    }
                ]
            },
            order: [
                [sortColumn, sortDirection]
            ],
            limit: limit
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

}
