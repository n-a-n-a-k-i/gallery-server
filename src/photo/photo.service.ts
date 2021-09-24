import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PhotoModel} from "./model/photo.model";

@Injectable()
export class PhotoService {

    constructor(
        @InjectModel(PhotoModel)
        private photoModel: typeof PhotoModel
    ) {
    }

    async findAll(limit: number = 20): Promise<PhotoModel[]> {

        return await this.photoModel.findAll({
            attributes: {
                exclude: ['thumbnail', 'preview']
            },
            limit: limit
        })

    }

}
