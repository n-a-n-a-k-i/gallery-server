import {Controller, Get, Param, ParseUUIDPipe, Query, Res, StreamableFile} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PhotoService} from "./photo.service";
import * as Buffer from "buffer";
import {Response} from "express";
import {PhotoDto} from "./dto/photo.dto";
import {FindAllDto} from "./dto/find.all.dto";
import {FindTotalDto} from "./dto/find.total.dto";
import {FindTotalDatePartDto} from "./dto/find.total.date.part.dto";
import {TotalDatePartDto} from "./dto/total.date.part.dto";
import {basename} from 'path';
import {createReadStream} from "fs";

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
        @Query() findAllDto: FindAllDto
    ): Promise<PhotoDto[]> {
        const photoModels = await this.photoService.findAll(findAllDto)
        return photoModels.map(photoModel => new PhotoDto(photoModel))
    }

    @ApiOperation({summary: 'Получить количество фотографий'})
    @ApiResponse({type: Number})
    @ApiBearerAuth('accessToken')
    @Get('/total')
    async findTotal(
        @Query() findTotalDto: FindTotalDto
    ): Promise<number> {
        return await this.photoService.findTotal(findTotalDto)
    }

    @ApiOperation({summary: 'Получить количество части даты'})
    @ApiBearerAuth('accessToken')
    @Get('/total/date/part')
    async findTotalDatePart(
        @Query() findTotalDatePartDto: FindTotalDatePartDto
    ): Promise<TotalDatePartDto[]> {
        return await this.photoService.findTotalDatePart(findTotalDatePartDto)
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

    @Get('/download/:id')
    async findPhoto(
        @Res({passthrough: true}) response: Response,
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string
    ): Promise<StreamableFile> {

        const fullFilePath = await this.photoService.getFullFilePath(id)

        response.attachment(basename(fullFilePath))
        response.contentType('image/jpeg')

        return new StreamableFile(createReadStream(fullFilePath))

    }

}
