import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {DATE, literal, TEXT, UUID} from "sequelize";
import {UserModel} from "../../user/model/user.model";

@Table({comment: 'Токен обновления', tableName: 'refresh_token', createdAt: false, updatedAt: false})
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

    @ApiProperty({description: 'Значение', example: 'crypto#xxxxx.yyyyy.zzzzz'})
    @Column({comment: 'Значение', type: TEXT, allowNull: false, unique: true})
    value: string

    @ApiProperty({description: 'Истекает', example: '2021-10-21T06:32:32.401Z'})
    @Column({comment: 'Истекает', type: DATE, allowNull: false})
    expiresIn: Date

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    @ForeignKey(() => UserModel)
    @Column({type: UUID})
    user: string

    @BelongsTo(() => UserModel)
    userModel: UserModel

}