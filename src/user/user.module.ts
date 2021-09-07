import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {UserModel} from "./model/user.model";
import {JwtModule} from "@nestjs/jwt";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
      SequelizeModule.forFeature([UserModel]),
      JwtModule.register({
          secret: process.env.JWT_SECRET || 'secret',
          signOptions: {
              expiresIn: process.env.JWT_EXPIRES_IN || '12s'
          }
      })
  ]
})
export class UserModule {}
