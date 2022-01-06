import {Controller, Get, Param, ParseEnumPipe, ParseUUIDPipe, Query, Res, StreamableFile} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PhotoService} from "./photo.service";
import {FindDto} from "./dto/find.dto";
import {basename} from 'path';
import {createReadStream} from "fs";
import {DateColumn} from "./enum/date.column.enum";
import {TotalDateDto} from "./dto/total.date.dto";
import {DatePart} from "./enum/date.part.enum";
import {PhotoDto} from "./dto/photo.dto";
import {FindTotalDto} from "./dto/find.total.dto";
import {Response} from "express";
import {PhotoModel} from "./model/photo.model";

@ApiTags('Фотография')
@Controller('photo')
export class PhotoController {

    constructor(private readonly photoService: PhotoService) {}

    @ApiOperation({summary: 'Поиск фотографий'})
    @ApiResponse({type: [PhotoDto]})
    @ApiBearerAuth('accessToken')
    @Get()
    async find(
        @Query() findDto: FindDto
    ): Promise<PhotoDto[]> {

        const photoModels: PhotoModel[] = await this.photoService.find(findDto)

        return photoModels.map(photoModel => new PhotoDto(photoModel))

    }

    @ApiOperation({summary: 'Скачивание файла фотографии'})
    @ApiBearerAuth('accessToken')
    @Get('/download/:id')
    async download(
        @Res({passthrough: true}) response: Response,
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string
    ): Promise<StreamableFile> {

        const fullFilePath: string = await this.photoService.download(id)

        response.attachment(basename(fullFilePath))
        response.contentType('image/jpeg')

        return new StreamableFile(createReadStream(fullFilePath))

    }

    @ApiOperation({summary: 'Поиск количества фотографий'})
    @ApiResponse({type: Number})
    @ApiBearerAuth('accessToken')
    @Get('/total')
    async findTotal(
        @Query() findTotalDto: FindTotalDto
    ): Promise<number> {

        return await this.photoService.findTotal(findTotalDto)

    }

    @ApiOperation({summary: 'Поиск количества фотографий по частям даты'})
    @ApiResponse({type: TotalDateDto})
    @ApiBearerAuth('accessToken')
    @Get('/total-date/:dateColumn')
    async findTotalDate(
        @Param('dateColumn', new ParseEnumPipe(DateColumn)) dateColumn: DateColumn
    ): Promise<TotalDateDto> {

        const totalDateDto: TotalDateDto = new TotalDateDto()

        totalDateDto.years = await this.photoService.findTotalDatePart(dateColumn, DatePart.year)
        totalDateDto.months = await this.photoService.findTotalDatePart(dateColumn, DatePart.month)
        totalDateDto.days = await this.photoService.findTotalDatePart(dateColumn, DatePart.day)

        return totalDateDto

    }

    @ApiOperation({summary: 'Поиск миниатюры'})
    @Get('/thumbnail/:id')
    async findThumbnail(
        @Res({passthrough: true}) response: Response,
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string
    ): Promise<StreamableFile> {

        const {thumbnail, mtime} = await this.photoService.findThumbnail(id)
        const fileBaseThumbnail = this.photoService.getFileBaseThumbnail(id, mtime)

        response.setHeader('Content-Disposition', `inline; filename="${fileBaseThumbnail}"`)
        response.contentType('image/jpeg')

        return new StreamableFile(thumbnail)

    }

    @ApiOperation({summary: 'Поиск предпросмотра'})
    @Get('/preview/:id')
    async findPreview(
        @Res({passthrough: true}) response: Response,
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string
    ): Promise<StreamableFile> {

        const {preview, mtime} = await this.photoService.findPreview(id)
        const fileBasePreview = this.photoService.getFileBasePreview(id, mtime)

        response.setHeader('Content-Disposition', `inline; filename="${fileBasePreview}"`)
        response.contentType('image/jpeg')

        return new StreamableFile(preview)

    }

}
