import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {PermissionModel} from "./model/permission.model";

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  imports: [
      SequelizeModule.forFeature([
          PermissionModel
      ])
  ]
})
export class PermissionModule {}
