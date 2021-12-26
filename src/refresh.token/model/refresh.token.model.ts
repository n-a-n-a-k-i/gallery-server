import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {DATE, literal, TEXT, UUID} from "sequelize";
import {UserModel} from "../../user/model/user.model";

@Table({comment: 'Токен обновления', tableName: 'refresh_token'})
export class RefreshTokenModel extends Model {

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

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    @ForeignKey(() => UserModel)
    @Column({comment: 'Пользователь', type: UUID, allowNull: false})
    user: string

    @ApiProperty({description: 'Хост', example: 'localhost'})
    @Column({comment: 'Хост', type: TEXT})
    host: string

    @ApiProperty({description: 'Клиентское приложение', example: 'PostmanRuntime/7.28.4'})
    @Column({comment: 'Клиентское приложение', type: TEXT})
    userAgent: string

    @ApiProperty({description: 'Значение', example: 'crypto#xxxxx.yyyyy.zzzzz'})
    @Column({comment: 'Значение', type: TEXT, allowNull: false, unique: true})
    value: string

    @ApiProperty({description: 'Дата истекания', example: '2021-10-21T06:32:32.401Z'})
    @Column({comment: 'Дата истекания', type: DATE, allowNull: false})
    expiredAt: Date

    @BelongsTo(() => UserModel)
    userModel: UserModel

}