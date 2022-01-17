import {Injectable} from "@nestjs/common";
import {join} from "path";
import {UtilityService} from "../utility/utility.service";

@Injectable()
export class CloudUtilityService {

    constructor(
        private utilityService: UtilityService
    ) {}

    /**
     * Название файла без расширения
     * @param mtime
     * @param id
     */
    getFileName(mtime: Date, id: string): string {

        const {formatNumber} = this.utilityService

        return process.env.NEXTCLOUD_FILE_NAME
            .split('{year}').join(mtime.getFullYear().toString())
            .split('{month}').join(formatNumber(mtime.getMonth() + 1, 2))
            .split('{day}').join(formatNumber(mtime.getDate(), 2))
            .split('{hours}').join(formatNumber(mtime.getHours(), 2))
            .split('{minutes}').join(formatNumber(mtime.getMinutes(), 2))
            .split('{seconds}').join(formatNumber(mtime.getSeconds(), 2))
            .split('{id}').join(id)

    }

    /**
     * Название файла
     * @param mtime
     * @param id
     */
    getFileBase(mtime: Date, id: string): string {

        const fileName = this.getFileName(mtime, id)

        return `${fileName}.${process.env.NEXTCLOUD_FILE_EXT}`

    }

    /**
     * Название файла для миниатюры
     * @param mtime
     * @param id
     */
    getFileBaseThumbnail(mtime: Date, id: string): string {

        const fileName = this.getFileName(mtime, id)

        return `${fileName} thumbnail.${process.env.NEXTCLOUD_FILE_EXT}`

    }

    /**
     * Название файла для предпросмотра
     * @param mtime
     * @param id
     */
    getFileBasePreview(mtime: Date, id: string): string {

        const fileName = this.getFileName(mtime, id)

        return `${fileName} preview.${process.env.NEXTCLOUD_FILE_EXT}`

    }

    /**
     * Пользовательский путь
     * @param cloudUsername
     * @param cloudPath
     */
    getUserPath(cloudUsername: string, cloudPath: string): string {

        return process.env.NEXTCLOUD_USER_PATH
            .split('{username}').join(cloudUsername)
            .split('{path}').join(cloudPath)

    }

    /**
     * Полный пользовательский путь
     * @param cloudUsername
     * @param cloudPath
     */
    getFullUserPath(cloudUsername: string, cloudPath: string): string {

        const userPath = this.getUserPath(cloudUsername, cloudPath)

        return join(process.env.NEXTCLOUD_PATH, userPath)

    }

    /**
     * Пользовательский путь синхронизации
     * @param mtime
     */
    getUserPathSync(mtime: Date): string {

        return process.env.NEXTCLOUD_USER_PATH_SYNC
            .split('{year}').join(mtime.getFullYear().toString())
            .split('{month}').join(this.utilityService.formatNumber(mtime.getMonth() + 1, 2))

    }

    /**
     * Полный пользовательский путь синхронизации
     * @param cloudUsername
     * @param cloudPathSync
     * @param mtime
     */
    getFullUserPathSync(cloudUsername: string, cloudPathSync: string, mtime: Date): string {

        const fullUserPath = this.getFullUserPath(cloudUsername, cloudPathSync)
        const userPathSync = this.getUserPathSync(mtime)

        return join(fullUserPath, userPathSync)

    }

    /**
     * Полный путь к файлу
     * @param id
     * @param mtime
     * @param cloudUsername
     * @param cloudPathSync
     */
    getFullFilePath(cloudUsername: string, cloudPathSync: string, mtime: Date, id: string): string {

        const fullUserPathSync = this.getFullUserPathSync(cloudUsername, cloudPathSync, mtime)
        const fileBase = this.getFileBase(mtime, id)

        return join(fullUserPathSync, fileBase)

    }

}
