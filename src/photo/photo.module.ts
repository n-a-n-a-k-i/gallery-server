import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";

@Module({
  controllers: [PhotoController],
  providers: [PhotoService],
  imports: [
      SequelizeModule.forFeature([PhotoModel])
  ]
})
export class PhotoModule {}
