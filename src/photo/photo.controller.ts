import {Controller, Get, Param, ParseEnumPipe, ParseUUIDPipe, Query, Res, StreamableFile} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PhotoService} from "./photo.service";
import * as Buffer from "buffer";
import {Response} from "express";
import {FindAllDto} from "./dto/find.all.dto";
import {basename} from 'path';
import {createReadStream} from "fs";
import {DateColumn} from "./enum/date.column.enum";
import {TotalDateDto} from "./dto/total.date.dto";
import {DatePart} from "./enum/date.part.enum";
import {PhotoDto} from "./dto/photo.dto";
import {FindTotalDto} from "./dto/find.total.dto";

@ApiTags('Фотография')
@Controller('photo')
export class PhotoController {

    constructor(private readonly photoService: PhotoService) {}

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

    @ApiOperation({summary: 'Получить количество по частям даты'})
    @ApiResponse({type: TotalDateDto})
    @ApiBearerAuth('accessToken')
    @Get('/total-date/:dateColumn')
    async findTotalDate(
        @Param('dateColumn', new ParseEnumPipe(DateColumn)) dateColumn: DateColumn
    ): Promise<TotalDateDto> {

        const totalDateDto = new TotalDateDto()

        totalDateDto.years = await this.photoService.findTotalDatePart(dateColumn, DatePart.year)
        totalDateDto.months = await this.photoService.findTotalDatePart(dateColumn, DatePart.month)
        totalDateDto.days = await this.photoService.findTotalDatePart(dateColumn, DatePart.day)

        return totalDateDto

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

        const fullFilePath: string = await this.photoService.getFullFilePath(id)

        response.attachment(basename(fullFilePath))
        response.contentType('image/jpeg')

        return new StreamableFile(createReadStream(fullFilePath))

    }

}
