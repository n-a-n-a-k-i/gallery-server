import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {PhotoQueryDto} from "./dto/photo.query.dto";
import {Op, where, fn, col} from "sequelize";

@Injectable()
export class PhotoService {

    constructor(
        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel
    ) {
    }

    async findAll(photoQueryDto: PhotoQueryDto): Promise<PhotoModel[]> {

        const conditions = []
        const dateParts = ['year', 'month', 'day']

        dateParts.forEach(datePart => {

            const key = datePart + 's'

            if (photoQueryDto[key].length) {

                conditions.push(
                    where(
                        fn('date_part', datePart, col('dateCreate')),
                        {
                            [Op.in]: photoQueryDto[key]
                        }
                    )
                )

            }

        })

        return await this.photoModel.findAll({
            attributes: {
                exclude: ['thumbnail', 'preview']
            },
            where: {
                [Op.and]: [
                    ...conditions,
                    {
                        [photoQueryDto.sortColumn]: {
                            [photoQueryDto.sortDirection === 'ASC' ? Op.gt : Op.lt]: new Date(photoQueryDto.timeStart)
                        }
                    }
                ]
            },
            order: [
                [photoQueryDto.sortColumn, photoQueryDto.sortDirection]
            ],
            limit: photoQueryDto.limit
        })

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
