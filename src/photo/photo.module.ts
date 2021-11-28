import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";
import {UserModule} from "../user/user.module";

@Module({
  controllers: [PhotoController],
  providers: [PhotoService],
  imports: [
      SequelizeModule.forFeature([PhotoModel]),
      UserModule
  ]
})
export class PhotoModule {}
