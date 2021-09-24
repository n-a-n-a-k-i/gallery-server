import {Controller, Get} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PhotoService} from "./photo.service";
import {PhotoListDto} from "./dto/photo.list.dto";

@ApiTags('Фотография')
@Controller('photo')
export class PhotoController {

    constructor(private readonly photoService: PhotoService) {
    }

    @ApiOperation({summary: 'Получить список фотографий'})
    @ApiResponse({type: [PhotoListDto]})
    @ApiBearerAuth('accessToken')
    @Get()
    async findAll() {

        const photoModels = await this.photoService.findAll()

        return photoModels.map(photoModel => new PhotoListDto(photoModel))

    }

}
