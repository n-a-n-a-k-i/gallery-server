import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {Op, where, fn, col, WhereOptions} from "sequelize";
import {FindAllDto} from "./dto/find.all.dto";
import {FindTotalDto} from "./dto/find.total.dto";
import {FindTotalDatePartDto} from "./dto/find.total.date.part.dto";
import {TotalDatePartDto} from "./dto/total.date.part.dto";
import {UserService} from "../user/user.service";
import {DatePart} from "./enum/date.part.enum";

@Injectable()
export class PhotoService {

    constructor(
        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel,
        private userService: UserService
    ) {}

    async findAll(findAllDto: FindAllDto): Promise<PhotoModel[]> {

        const {dateColumn, orderDirection, limit, offset} = findAllDto

        return await this.photoModel.findAll({
            attributes: {
                exclude: ['thumbnail', 'preview']
            },
            where: this.getWhereOptions(findAllDto),
            order: [
                [dateColumn, orderDirection],
                'id'
            ],
            limit,
            offset
        })

    }

    async findTotal(findTotalDto: FindTotalDto): Promise<number> {

        return await this.photoModel.count({
            where: this.getWhereOptions(findTotalDto)
        })

    }

    async findTotalDatePart(findTotalDatePartDto: FindTotalDatePartDto): Promise<TotalDatePartDto[]> {

        const {datePart, dateColumn} = findTotalDatePartDto
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

    async findThumbnail(id: string): Promise<Buffer> {

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
                    'mtime',
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

        return photoModel.thumbnail

    }

    async findPreview(id: string): Promise<Buffer> {

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
                    'mtime',
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

        return photoModel.preview

    }

    async findDate(id: string): Promise<Date> {

        const photoModel: PhotoModel = await this.photoModel.findByPk(id, {
            attributes: {
                exclude: [
                    'id',
                    'hash',
                    'thumbnail',
                    'preview',
                    'user',
                    // 'date',
                    'atime',
                    'mtime',
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

        return photoModel.date

    }

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

    numberToString(number: number, size: number, char: string = '0'): string {

        let result = number.toString()

        while (result.length < size) result = char + result

        return result

    }

    async getFullFilePath(id: string): Promise<string> {

        const date = await this.findDate(id)
        const {cloudUsername, cloudDirSync} = await this.userService.findById(process.env.NEXTCLOUD_OWNER)

        return process.env.NEXTCLOUD_PHOTO
            .split('{username}').join(cloudUsername)
            .split('{dirSync}').join(cloudDirSync)
            .split('{year}').join(date.getFullYear().toString())
            .split('{month}').join(this.numberToString(date.getMonth() + 1, 2))
            .split('{day}').join(this.numberToString(date.getDate(), 2))
            .split('{hours}').join(this.numberToString(date.getHours(), 2))
            .split('{minutes}').join(this.numberToString(date.getMinutes(), 2))
            .split('{seconds}').join(this.numberToString(date.getSeconds(), 2))
            .split('{id}').join(id)

    }

}
