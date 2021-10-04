import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {Op, where, fn, col, WhereOptions} from "sequelize";
import {PhotoQueryFindAllDto} from "./dto/photo.query.find.all.dto";
import {PhotoQueryFindTotalDto} from "./dto/photo.query.find.total.dto";

@Injectable()
export class PhotoService {

    constructor(
        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel
    ) {
    }

    async findAll(photoQueryFindAllDto: PhotoQueryFindAllDto): Promise<PhotoModel[]> {

        const datePartConditions = this.getDatePartConditions(photoQueryFindAllDto)
        const {timeStart, limit, sortColumn, sortDirection} = photoQueryFindAllDto

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

    async findTotal(photoQueryFindTotalDto: PhotoQueryFindTotalDto): Promise<number> {

        const datePartConditions = this.getDatePartConditions(photoQueryFindTotalDto)

        return await this.photoModel.count({
            where: {
                [Op.and]: datePartConditions
            }
        })

    }

    getDatePartConditions(photoQueryFindTotalDto: PhotoQueryFindTotalDto): WhereOptions<WhereOptions>[] {

        const conditions = []
        const dateParts = ['year', 'month', 'day']

        dateParts.forEach(datePart => {

            const items = photoQueryFindTotalDto[datePart + 's']

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
