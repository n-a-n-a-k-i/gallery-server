import {ApiProperty} from "@nestjs/swagger";
import {PhotoModel} from "../model/photo.model";

export class PhotoListDto {

    constructor(photoModel: PhotoModel) {
        this.id = photoModel.id
        this.dateCreate = photoModel.dateCreate
        this.dateImport = photoModel.dateImport
        this.user = photoModel.user
    }

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    readonly id: string

    @ApiProperty({description: 'Дата создания файла', example: '2021-10-21T06:32:32.401Z'})
    readonly dateCreate: Date

    @ApiProperty({description: 'Дата импорта файла', example: '2021-10-21T06:32:32.401Z'})
    readonly dateImport: Date

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    readonly user: string

}