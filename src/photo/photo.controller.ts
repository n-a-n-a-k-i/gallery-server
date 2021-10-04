import {Controller, Get, Param, ParseUUIDPipe, Query, Res, StreamableFile} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PhotoService} from "./photo.service";
import * as Buffer from "buffer";
import {Response} from "express";
import {PhotoDto} from "./dto/photo.dto";
import {PhotoFindAllDto} from "./dto/photo.find.all.dto";
import {PhotoFindTotalDto} from "./dto/photo.find.total.dto";
import {PhotoFindTotalDatePartDto} from "./dto/photo.find.total.date.part.dto";
import {PhotoTotalDatePartDto} from "./dto/photo.total.date.part.dto";

@ApiTags('Фотография')
@Controller('photo')
export class PhotoController {

    constructor(private readonly photoService: PhotoService) {
    }

    @ApiOperation({summary: 'Получить список фотографий'})
    @ApiResponse({type: [PhotoDto]})
    @ApiBearerAuth('accessToken')
    @Get()
    async findAll(
        @Query() photoFindAllDto: PhotoFindAllDto
    ): Promise<PhotoDto[]> {
        const photoModels = await this.photoService.findAll(photoFindAllDto)
        return photoModels.map(photoModel => new PhotoDto(photoModel))
    }

    @ApiOperation({summary: 'Получить количество фотографий'})
    @ApiResponse({type: Number})
    @ApiBearerAuth('accessToken')
    @Get('/total')
    async findTotal(
        @Query() photoFindTotalDto: PhotoFindTotalDto
    ): Promise<number> {
        return await this.photoService.findTotal(photoFindTotalDto)
    }

    @ApiOperation({summary: 'Получить количество части даты'})
    @ApiBearerAuth('accessToken')
    @Get('/total/date/part')
    async findTotalDatePart(
        @Query() photoFindTotalDatePartDto: PhotoFindTotalDatePartDto
    ): Promise<PhotoTotalDatePartDto[]> {
        return await this.photoService.findTotalDatePart(photoFindTotalDatePartDto)
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
