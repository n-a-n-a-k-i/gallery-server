import {Controller, Get, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PhotoService} from "./photo.service";
import {PhotoListDto} from "./dto/photo.list.dto";
import {PhotoQueryDto} from "./dto/photo.query.dto";

@ApiTags('Фотография')
@Controller('photo')
export class PhotoController {

    constructor(private readonly photoService: PhotoService) {
    }

    @ApiOperation({summary: 'Получить список фотографий'})
    @ApiResponse({type: [PhotoListDto]})
    @ApiBearerAuth('accessToken')
    @Get()
    @UsePipes(new ValidationPipe({transform: true}))
    async findAll(@Query() photoQueryDto: PhotoQueryDto) {

        console.log(photoQueryDto)

        const photoModels = await this.photoService.findAll(photoQueryDto)

        return photoModels.map(photoModel => new PhotoListDto(photoModel))

    }

}
