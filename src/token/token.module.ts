import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {TokenModel} from "./model/token.model";

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  imports: [
      SequelizeModule.forFeature([TokenModel])
  ]
})
export class TokenModule {}
