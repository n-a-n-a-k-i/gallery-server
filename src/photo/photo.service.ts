import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {Op, where, fn, col, WhereOptions} from "sequelize";
import {FindAllDto} from "./dto/find.all.dto";
import {FindTotalDto} from "./dto/find.total.dto";
import {TotalDatePartDto} from "./dto/total.date.part.dto";
import {UserService} from "../user/user.service";
import {DatePart} from "./enum/date.part.enum";
import {UtilService} from "../util/util.service";
import {DateColumn} from "./enum/date.column.enum";

@Injectable()
export class PhotoService {

    constructor(

        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel,

        private userService: UserService,

        private utilService: UtilService

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

    async getFullFilePath(id: string): Promise<string> {

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

        const {cloudUsername, cloudDirSync} = await this.userService.findById(process.env.NEXTCLOUD_OWNER)
        const {numberToString} = this.utilService

        return process.env.NEXTCLOUD_PHOTO
            .split('{username}').join(cloudUsername)
            .split('{dirSync}').join(cloudDirSync)
            .split('{year}').join(mtime.getFullYear().toString())
            .split('{month}').join(numberToString(mtime.getMonth() + 1, 2))
            .split('{day}').join(numberToString(mtime.getDate(), 2))
            .split('{hours}').join(numberToString(mtime.getHours(), 2))
            .split('{minutes}').join(numberToString(mtime.getMinutes(), 2))
            .split('{seconds}').join(numberToString(mtime.getSeconds(), 2))
            .split('{id}').join(id)

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

}
