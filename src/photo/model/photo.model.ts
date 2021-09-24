import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {BLOB, DATE, literal, TEXT, UUID} from "sequelize";
import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../../user/model/user.model";

@Table({comment: 'Фотография', tableName: 'photo', createdAt: false, updatedAt: false})
export class PhotoModel extends Model {

    @ApiProperty({description: 'Идентификатор', example: '00000000-0000-0000-0000-000000000000'})
    @Column({
        comment: 'Идентификатор',
        type: UUID,
        defaultValue: literal('gen_random_uuid()'),
        allowNull: false,
        unique: true,
        primaryKey: true
    })
    id: string

    @ApiProperty({description: 'Хеш', example: 'crypto#bytea'})
    @Column({comment: 'Хеш', type: TEXT, allowNull: false, unique: true})
    hash: string

    @ApiProperty({description: 'Дата создания файла', example: '2021-10-21T06:32:32.401Z'})
    @Column({comment: 'Дата создания файла', type: DATE, allowNull: false})
    dateCreate: Date

    @ApiProperty({description: 'Дата импорта файла', example: '2021-10-21T06:32:32.401Z'})
    @Column({comment: 'Дата импорта файла', type: DATE, allowNull: false})
    dateImport: Date

    @ApiProperty({description: 'Плитка 256x256 без сохранения пропорций', example: 'bytea'})
    @Column({comment: 'Плитка 256x256', type: BLOB, allowNull: false})
    thumbnail: Buffer

    @ApiProperty({description: 'Предпросмотр до 1024x1024 с сохранением пропорций', example: 'bytea'})
    @Column({comment: 'Предпросмотр до 1024x1024 с сохранением пропорций', type: BLOB, allowNull: false})
    preview: Buffer

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    @ForeignKey(() => UserModel)
    @Column({comment: 'Пользователь', type: UUID, allowNull: false})
    user: string

    @BelongsTo(() => UserModel)
    userModel: UserModel

}