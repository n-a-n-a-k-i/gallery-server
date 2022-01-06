import {ApiProperty} from "@nestjs/swagger";
import {PhotoModel} from "../model/photo.model";
import {IsDate} from "class-validator";

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
    @IsDate()
    readonly date: Date

    @ApiProperty({
        description: 'Дата открытия файла',
        format: 'date-time'
    })
    @IsDate()
    readonly atime: Date

    @ApiProperty({
        description: 'Дата изменения содержимого файла',
        format: 'date-time'
    })
    @IsDate()
    readonly mtime: Date

    @ApiProperty({
        description: 'Дата изменения свойств файла',
        format: 'date-time'
    })
    @IsDate()
    readonly ctime: Date

    @ApiProperty({
        description: 'Дата создания файла',
        format: 'date-time'
    })
    @IsDate()
    readonly birthtime: Date

    @ApiProperty({
        description: 'Дата создания',
        format: 'date-time'
    })
    @IsDate()
    readonly createdAt: Date

    @ApiProperty({
        description: 'Дата изменения',
        format: 'date-time'
    })
    @IsDate()
    readonly updatedAt: Date

}
