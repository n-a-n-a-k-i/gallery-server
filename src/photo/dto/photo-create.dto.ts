import {ApiProperty} from "@nestjs/swagger";

export class PhotoCreateDto {

    @ApiProperty({
        description: 'Пользователь',
        format: 'uuid'
    })
    user: string

    @ApiProperty({
        description: 'Хеш',
        format: 'crypto'
    })
    hash: string

    @ApiProperty({
        description: 'Миниатюра 256x256 без сохранения пропорций',
        format: 'bytea'
    })
    thumbnail: Buffer

    @ApiProperty({
        description: 'Предпросмотр до 1024x1024 с сохранением пропорций',
        format: 'bytea'
    })
    preview: Buffer

    @ApiProperty({
        description: 'Дата',
        format: 'date-time'
    })
    date: Date

    @ApiProperty({
        description: 'Дата открытия файла',
        format: 'date-time'
    })
    atime: Date

    @ApiProperty({
        description: 'Дата изменения содержимого файла',
        format: 'date-time'
    })
    mtime: Date

    @ApiProperty({
        description: 'Дата изменения свойств файла',
        format: 'date-time'
    })
    ctime: Date

    @ApiProperty({
        description: 'Дата создания файла',
        format: 'date-time'
    })
    birthtime: Date

}
