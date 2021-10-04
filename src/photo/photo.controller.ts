import {Controller, Get, Param, ParseUUIDPipe, Query, Res, StreamableFile} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PhotoService} from "./photo.service";
import * as Buffer from "buffer";
import {Response} from "express";
import {PhotoQueryFindAllDto} from "./dto/photo.query.find.all.dto";
import {PhotoListDto} from "./dto/photo.list.dto";
import {PhotoQueryFindTotalDto} from "./dto/photo.query.find.total.dto";

@ApiTags('Фотография')
@Controller('photo')
export class PhotoController {

    constructor(private readonly photoService: PhotoService) {
    }

    @ApiOperation({summary: 'Получить список фотографий'})
    @ApiResponse({type: [PhotoListDto]})
    @ApiBearerAuth('accessToken')
    @Get()
    async findAll(
        @Query() photoQueryFindAllDto: PhotoQueryFindAllDto
    ): Promise<PhotoListDto[]> {
        const photoModels = await this.photoService.findAll(photoQueryFindAllDto)
        return photoModels.map(photoModel => new PhotoListDto(photoModel))
    }

    @ApiOperation({summary: 'Получить количество фотографий'})
    @ApiResponse({type: Number})
    @ApiBearerAuth('accessToken')
    @Get('/total')
    async findTotal(
        @Query() photoQueryFindTotalDto: PhotoQueryFindTotalDto
    ): Promise<number> {
        return await this.photoService.findTotal(photoQueryFindTotalDto)
    }

    @Get('/thumbnail/:id')
    async findThumbnail(
        @Res({passthrough: true}) response: Response,
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string
    ): Promise<StreamableFile> {
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
    ): Promise<StreamableFile> {
        const buffer: Buffer = await this.photoService.findPreview(id)
        response.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `inline; filename="${id}.jpg"`,
            'Content-Length': buffer.length
        })
        return new StreamableFile(buffer)
    }

}
