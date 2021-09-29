import {Controller, Get, Param, ParseUUIDPipe, Query, Res, StreamableFile} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PhotoService} from "./photo.service";
import {PhotoListDto} from "./dto/photo.list.dto";
import {PhotoQueryDto} from "./dto/photo.query.dto";
import * as Buffer from "buffer";
import {Response} from "express";

@ApiTags('Фотография')
@Controller('photo')
export class PhotoController {

    constructor(private readonly photoService: PhotoService) {
    }

    @ApiOperation({summary: 'Получить список фотографий'})
    @ApiResponse({type: [PhotoListDto]})
    @ApiBearerAuth('accessToken')
    @Get()
    async findAll(@Query() photoQueryDto: PhotoQueryDto) {
        const photoModels = await this.photoService.findAll(photoQueryDto)
        return photoModels.map(photoModel => new PhotoListDto(photoModel))
    }

    @Get('/thumbnail/:id')
    async findThumbnail(
        @Res({passthrough: true}) response: Response,
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string
    ) {
        const buffer: Buffer = await this.photoService.findThumbnail(id)
        response.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `inline; filename="${id}.jpg"`,
            'Content-Length': buffer.length
        })
        return new StreamableFile(buffer)
    }

    @Get('/preview/:id')
    async findPreview(
        @Res({passthrough: true}) response: Response,
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string
    ) {
        const buffer: Buffer = await this.photoService.findPreview(id)
        response.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `inline; filename="${id}.jpg"`,
            'Content-Length': buffer.length
        })
        return new StreamableFile(buffer)
    }

}
