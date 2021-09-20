import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {literal, TEXT, UUID} from "sequelize";
import {UserModel} from "../../user/model/user.model";

@Table({comment: 'Токен', tableName: 'token', createdAt: false, updatedAt: false})
export class TokenModel extends Model {

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

    @ApiProperty({description: 'Значение', example: 'xxxxx.yyyyy.zzzzz'})
    @Column({comment: 'Значение', type: TEXT, allowNull: false, unique: true})
    value: string

    @ApiProperty({description: 'Пользователь', example: '00000000-0000-0000-0000-000000000000'})
    @ForeignKey(() => UserModel)
    @Column({type: UUID})
    user: string

    @BelongsTo(() => UserModel)
    userModel: UserModel

}