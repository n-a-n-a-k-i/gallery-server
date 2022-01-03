import {ApiProperty} from "@nestjs/swagger";
import {PhotoModel} from "../model/photo.model";

export class PhotoDto {

    constructor(photoModel: PhotoModel) {

        this.id = photoModel.id
        this.user = photoModel.user
        this.date = photoModel.date

        this.atime = photoModel.atime
        this.mtime = photoModel.mtime
        this.ctime = photoModel.ctime
        this.birthtime = photoModel.birthtime

        this.createdAt = photoModel.createdAt
        this.updatedAt = photoModel.updatedAt

    }

    @ApiProperty({
        description: 'Идентификатор',
        format: 'uuid'
    })
    readonly id: string

    @ApiProperty({
        description: 'Пользователь',
        format: 'uuid'
    })
    readonly user: string

    @ApiProperty({
        description: 'Дата',
        format: 'date-time'
    })
    readonly date: Date

    @ApiProperty({
        description: 'Дата открытия файла',
        format: 'date-time'
    })
    readonly atime: Date

    @ApiProperty({
        description: 'Дата изменения содержимого файла',
        format: 'date-time'
    })
    readonly mtime: Date

    @ApiProperty({
        description: 'Дата изменения свойств файла',
        format: 'date-time'
    })
    readonly ctime: Date

    @ApiProperty({
        description: 'Дата создания файла',
        format: 'date-time'
    })
    readonly birthtime: Date

    @ApiProperty({
        description: 'Дата создания',
        format: 'date-time'
    })
    readonly createdAt: Date

    @ApiProperty({
        description: 'Дата изменения',
        format: 'date-time'
    })
    readonly updatedAt: Date

}
