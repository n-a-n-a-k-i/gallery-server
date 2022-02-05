import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {Op, where, fn, col, WhereOptions} from "sequelize";
import {FindDto} from "./dto/find.dto";
import {FindTotalDto} from "./dto/find-total.dto";
import {TotalDatePartDto} from "./dto/total-date-part.dto";
import {DatePart} from "./enum/date-part.enum";
import {DateColumn} from "./enum/date-column.enum";
import {OrderDirection} from "./enum/order-direction.enum";
import {PathLike, Stats} from 'fs'
import {readFile, stat} from 'fs/promises'
import {createHash} from "crypto"
import {PhotoCreateDto} from "./dto/photo-create.dto";
import * as sharp from 'sharp'

@Injectable()
export class PhotoService {

    constructor(
        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel
    ) {}

    /**
     * Создание фотографии
     * @param path
     * @param user
     */
    async create(path: PathLike, user: string): Promise<PhotoModel> {

        const file: Buffer = await readFile(path)
        const algorithm: string = process.env.CRYPTO_PHOTO_HASH_ALGORITHM
        const hash: string = createHash(algorithm).update(file).digest('hex')
        const isExist = await this.isExistByHash(hash)

        if (isExist) {
            throw new BadRequestException(hash, 'Дубликат')
        }

        const photoCreateDto: PhotoCreateDto = new PhotoCreateDto()
        const {atime, mtime, ctime, birthtime}: Stats = await stat(path)

        photoCreateDto.user = user
        photoCreateDto.hash = hash
        photoCreateDto.thumbnail = await sharp(file).rotate().resize({
            width: eval(process.env.PHOTO_THUMBNAIL_WIDTH),
            height: eval(process.env.PHOTO_THUMBNAIL_HEIGHT),
            fit: process.env.PHOTO_THUMBNAIL_FIT
        }).toBuffer()
        photoCreateDto.preview = await sharp(file).rotate().resize({
            width: eval(process.env.PHOTO_PREVIEW_WIDTH),
            height: eval(process.env.PHOTO_PREVIEW_HEIGHT),
            fit: process.env.PHOTO_PREVIEW_FIT
        }).toBuffer()
        photoCreateDto.date = mtime
        photoCreateDto.atime = atime
        photoCreateDto.mtime = mtime
        photoCreateDto.ctime = ctime
        photoCreateDto.birthtime = birthtime

        try {

            return await this.photoModel.create(photoCreateDto, {
                returning: [
                    'id',
                    'hash',
                    // 'thumbnail',
                    // 'preview',
                    'user',
                    'date',
                    'atime',
                    'mtime',
                    'ctime',
                    'birthtime',
                    'createdAt',
                    'updatedAt',
                    'deletedAt'
                ]
            })

        } catch (error) {

            throw new InternalServerErrorException(error, 'Ошибка при создании фотографии')

        }

    }

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
                    'updatedAt',
                    'deletedAt'
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
                    'updatedAt',
                    'deletedAt'
                ]
            }
        })

        if (!photoModel) {
            throw new NotFoundException('Фотография не найдена')
        }

        return photoModel

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
                    'updatedAt',
                    'deletedAt'
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
     * Удаление фотографии
     * @param id
     */
    async remove(id: string): Promise<void> {

        await this.photoModel.destroy({
            where: {id}
        })

    }

    /**
     * Поиск наличия фотографии по хешу
     * @param hash
     */
    async isExistByHash(hash: string): Promise<boolean> {

        const photoModel: PhotoModel = await this.photoModel.findOne({
            attributes: {
                exclude: [
                    'id',
                    // 'hash',
                    'thumbnail',
                    'preview',
                    'user',
                    'date',
                    'atime',
                    'mtime',
                    'ctime',
                    'birthtime',
                    'createdAt',
                    'updatedAt',
                    'deletedAt'
                ]
            },
            where: {hash}
        })

        return !!photoModel

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
