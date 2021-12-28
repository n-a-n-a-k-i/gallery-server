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

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    readonly id: string

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    readonly user: string

    @ApiProperty({description: 'Дата', example: '2021-11-11T11:11:11.000Z'})
    readonly date: Date

    @ApiProperty({description: 'Дата открытия файла', example: '2021-11-11T11:11:11.000Z'})
    readonly atime: Date

    @ApiProperty({description: 'Дата изменения содержимого файла', example: '2021-11-11T11:11:11.000Z'})
    readonly mtime: Date

    @ApiProperty({description: 'Дата изменения свойств файла', example: '2021-11-11T11:11:11.000Z'})
    readonly ctime: Date

    @ApiProperty({description: 'Дата создания файла', example: '2021-11-11T11:11:11.000Z'})
    readonly birthtime: Date

    @ApiProperty({description: 'Дата создания', example: '2021-11-11T11:11:11.000Z'})
    readonly createdAt: Date

    @ApiProperty({description: 'Дата изменения', example: '2021-11-11T11:11:11.000Z'})
    readonly updatedAt: Date

}
