import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {DATE, literal, TEXT, UUID} from "sequelize";
import {UserModel} from "../../user/model/user.model";

@Table({comment: 'Токен обновления', tableName: 'refresh_token'})
export class RefreshTokenModel extends Model {

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
        description: 'Хост',
        format: 'hostname'
    })
    @Column({
        comment: 'Хост',
        type: TEXT
    })
    host: string

    @ApiProperty({
        description: 'Клиентское приложение',
        example: 'PostmanRuntime'
    })
    @Column({
        comment: 'Клиентское приложение',
        type: TEXT
    })
    userAgent: string

    @ApiProperty({
        description: 'Значение',
        format: 'crypto'
    })
    @Column({
        comment: 'Значение',
        type: TEXT,
        allowNull: false,
        unique: true
    })
    value: string

    @ApiProperty({
        description: 'Дата истекания',
        format: 'date-time'
    })
    @Column({
        comment: 'Дата истекания',
        type: DATE,
        allowNull: false
    })
    expiredAt: Date

    @BelongsTo(() => UserModel)
    userModel: UserModel

}
