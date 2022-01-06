import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {Op, where, fn, col, WhereOptions} from "sequelize";
import {FindDto} from "./dto/find.dto";
import {FindTotalDto} from "./dto/find.total.dto";
import {TotalDatePartDto} from "./dto/total.date.part.dto";
import {UserService} from "../user/user.service";
import {DatePart} from "./enum/date.part.enum";
import {UtilityService} from "../utility/utility.service";
import {DateColumn} from "./enum/date.column.enum";
import {join} from 'path'

@Injectable()
export class PhotoService {

    constructor(

        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel,

        private userService: UserService,

        private utilityService: UtilityService

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
     * Скачивание файла фотографии
     * @param id
     */
    async download(id: string): Promise<string> {

        const {mtime} = await this.photoModel.findByPk(id, {
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

        if (!mtime) {
            throw new NotFoundException('Фотография не найдена')
        }

        const {cloudUsername, cloudPathSync} = await this.userService.findById(process.env.NEXTCLOUD_OWNER)

        return this.getFullFilePath(id, mtime, cloudUsername, cloudPathSync)

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
     */
    async findTotalDatePart(dateColumn: DateColumn, datePart: DatePart): Promise<TotalDatePartDto[]> {

        const group = fn('date_part', datePart, col(dateColumn))
        const photoModels = await this.photoModel.findAll({
            attributes: [
                [fn('distinct', group), 'value'],
                [fn('count', col('id')), 'total']
            ],
            group,
            order: [
                col('value')
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

    /**
     * Название файла без расширения
     * @param id
     * @param mtime
     */
    getFileName(id: string, mtime: Date): string {

        const {formatNumber} = this.utilityService

        return process.env.NEXTCLOUD_FILE_NAME
            .split('{year}').join(mtime.getFullYear().toString())
            .split('{month}').join(formatNumber(mtime.getMonth() + 1, 2))
            .split('{day}').join(formatNumber(mtime.getDate(), 2))
            .split('{hours}').join(formatNumber(mtime.getHours(), 2))
            .split('{minutes}').join(formatNumber(mtime.getMinutes(), 2))
            .split('{seconds}').join(formatNumber(mtime.getSeconds(), 2))
            .split('{id}').join(id)
    }

    /**
     * Название файла
     * @param id
     * @param mtime
     */
    getFileBase(id: string, mtime: Date): string {

        const fileName = this.getFileName(id, mtime)

        return `${fileName}.${process.env.NEXTCLOUD_FILE_EXT}`

    }

    /**
     * Название файла для миниатюры
     * @param id
     * @param mtime
     */
    getFileBaseThumbnail(id: string, mtime: Date): string {

        const fileName = this.getFileName(id, mtime)

        return `${fileName} thumbnail.${process.env.NEXTCLOUD_FILE_EXT}`

    }

    /**
     * Название файла для предпросмотра
     * @param id
     * @param mtime
     */
    getFileBasePreview(id: string, mtime: Date): string {

        const fileName = this.getFileName(id, mtime)

        return `${fileName} preview.${process.env.NEXTCLOUD_FILE_EXT}`

    }

    /**
     * Полный путь к файлу для скачивания
     * @param id
     * @param mtime
     * @param cloudUsername
     * @param cloudPathSync
     */
    getFullFilePath(id: string, mtime: Date, cloudUsername: string, cloudPathSync: string): string {

        const fileBase = this.getFileBase(id, mtime)
        const userPath = process.env.NEXTCLOUD_USER_PATH
            .split('{username}').join(cloudUsername)
            .split('{pathSync}').join(cloudPathSync)
            .split('{year}').join(mtime.getFullYear().toString())
            .split('{month}').join(this.utilityService.formatNumber(mtime.getMonth() + 1, 2))

        return join(process.env.NEXTCLOUD_PATH, userPath, fileBase)

    }

}
