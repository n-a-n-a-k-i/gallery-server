import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {Op, where, fn, col, WhereOptions} from "sequelize";
import {FindDto} from "./dto/find.dto";
import {FindTotalDto} from "./dto/find-total.dto";
import {TotalDatePartDto} from "./dto/total-date-part.dto";
import {DatePart} from "./enum/date-part.enum";
import {DateColumn} from "./enum/date-column.enum";
import {OrderDirection} from "./enum/order-direction.enum";

@Injectable()
export class PhotoService {

    constructor(
        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel
    ) {}

    /**
     * Поиск фотографий
     * @param findDto
     */
    async find(findDto: FindDto): Promise<PhotoModel[]> {

        const {dateColumn, orderDirection, limit, offset} = findDto

        return await this.photoModel.findAll({
            attributes: {
                exclude: ['thumbnail', 'preview']
            },
            where: this.getWhereOptions(findDto),
            order: [
                [dateColumn, orderDirection],
                'id'
            ],
            limit,
            offset
        })

    }

    /**
     * Поиск даты изменения содержимого файла
     * @param id
     */
    async findMtime(id: string): Promise<Date> {

        const photoModel: PhotoModel = await this.photoModel.findByPk(id, {
            attributes: {
                exclude: [
                    'id',
                    'hash',
                    'thumbnail',
                    'preview',
                    'user',
                    'date',
                    'atime',
                    // 'mtime',
                    'ctime',
                    'birthtime',
                    'createdAt',
                    'updatedAt'
                ]
            }
        })

        if (!photoModel) {
            throw new NotFoundException('Фотография не найдена')
        }

        return photoModel.mtime

    }

    /**
     * Поиск количества фотографий
     * @param findTotalDto
     */
    async findTotal(findTotalDto: FindTotalDto): Promise<number> {

        return await this.photoModel.count({
            where: this.getWhereOptions(findTotalDto)
        })

    }

    /**
     * Поиск количества фотографий по частям даты
     * @param dateColumn
     * @param datePart
     * @param orderDirection
     */
    async findTotalDatePart(dateColumn: DateColumn, datePart: DatePart, orderDirection: OrderDirection): Promise<TotalDatePartDto[]> {

        const group = fn('date_part', datePart, col(dateColumn))
        const photoModels = await this.photoModel.findAll({
            attributes: [
                [fn('distinct', group), 'value'],
                [fn('count', col('id')), 'total']
            ],
            group,
            order: [
                [col('value'), orderDirection]
            ]
        })

        return photoModels.map(photoModel => new TotalDatePartDto(photoModel))

    }

    /**
     * Поиск миниатюры
     * @param id
     */
    async findThumbnail(id: string): Promise<PhotoModel> {

        const photoModel: PhotoModel = await this.photoModel.findByPk(id, {
            attributes: {
                exclude: [
                    'id',
                    'hash',
                    // 'thumbnail',
                    'preview',
                    'user',
                    'date',
                    'atime',
                    // 'mtime',
                    'ctime',
                    'birthtime',
                    'createdAt',
                    'updatedAt'
                ]
            }
        })

        if (!photoModel) {
            throw new NotFoundException('Фотография не найдена')
        }

        return photoModel

    }

    /**
     * Поиск предпросмотра
     * @param id
     */
    async findPreview(id: string): Promise<PhotoModel> {

        const photoModel: PhotoModel = await this.photoModel.findByPk(id, {
            attributes: {
                exclude: [
                    'id',
                    'hash',
                    'thumbnail',
                    // 'preview',
                    'user',
                    'date',
                    'atime',
                    // 'mtime',
                    'ctime',
                    'birthtime',
                    'createdAt',
                    'updatedAt'
                ]
            }
        })

        if (!photoModel) {
            throw new NotFoundException('Фотография не найдена')
        }

        return photoModel

    }

    /**
     * Параметры фильтрации:
     * 1. Поиск фотографий.
     * 2. Поиск количества фотографий.
     * @param findTotalDto
     */
    getWhereOptions(findTotalDto: FindTotalDto): WhereOptions {

        const conditions: WhereOptions[] = [];

        Object.keys(DatePart).forEach(datePart => {

            const values = findTotalDto[datePart + 's']

            if (values.length) {

                conditions.push(
                    where(fn('date_part', datePart, col(findTotalDto.dateColumn)), {
                        [Op.in]: values
                    })
                )

            }

        })

        return {
            [Op.and]: conditions
        }

    }

}
