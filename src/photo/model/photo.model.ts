import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {BLOB, DATE, literal, TEXT, UUID} from "sequelize";
import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../../user/model/user.model";

@Table({comment: 'Фотография', tableName: 'photo'})
export class PhotoModel extends Model {

    @ApiProperty({
        description: 'Идентификатор',
        format: 'uuid'
    })
    @Column({
        comment: 'Идентификатор',
        type: UUID,
        defaultValue: literal('gen_random_uuid()'),
        allowNull: false,
        unique: true,
        primaryKey: true
    })
    id: string

    @ApiProperty({
        description: 'Пользователь',
        format: 'uuid'
    })
    @ForeignKey(() => UserModel)
    @Column({
        comment: 'Пользователь',
        type: UUID,
        allowNull: false
    })
    user: string

    @ApiProperty({
        description: 'Хеш',
        format: 'crypto'
    })
    @Column({
        comment: 'Хеш',
        type: TEXT,
        allowNull: false,
        unique: true
    })
    hash: string

    @ApiProperty({
        description: 'Миниатюра 256x256 без сохранения пропорций',
        format: 'bytea'
    })
    @Column({
        comment: 'Миниатюра 256x256 без сохранения пропорций',
        type: BLOB,
        allowNull: false
    })
    thumbnail: Buffer

    @ApiProperty({
        description: 'Предпросмотр до 1024x1024 с сохранением пропорций',
        format: 'bytea'
    })
    @Column({
        comment: 'Предпросмотр до 1024x1024 с сохранением пропорций',
        type: BLOB,
        allowNull: false
    })
    preview: Buffer

    @ApiProperty({
        description: 'Дата',
        format: 'date-time'
    })
    @Column({
        comment: 'Дата',
        type: DATE,
        allowNull: false
    })
    date: Date

    @ApiProperty({
        description: 'Дата открытия файла',
        format: 'date-time'
    })
    @Column({
        comment: 'Дата открытия файла',
        type: DATE,
        allowNull: false
    })
    atime: Date

    @ApiProperty({
        description: 'Дата изменения содержимого файла',
        format: 'date-time'
    })
    @Column({
        comment: 'Дата изменения содержимого файла',
        type: DATE,
        allowNull: false
    })
    mtime: Date

    @ApiProperty({
        description: 'Дата изменения свойств файла',
        format: 'date-time'
    })
    @Column({
        comment: 'Дата изменения свойств файла',
        type: DATE,
        allowNull: false
    })
    ctime: Date

    @ApiProperty({
        description: 'Дата создания файла',
        format: 'date-time'
    })
    @Column({
        comment: 'Дата создания файла',
        type: DATE,
        allowNull: false
    })
    birthtime: Date

    @BelongsTo(() => UserModel)
    userModel: UserModel

}
