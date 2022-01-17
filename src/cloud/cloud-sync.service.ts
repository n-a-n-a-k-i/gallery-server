import {BadRequestException, ConflictException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {SyncState} from "./interface/sync-state.interface";
import {UserService} from "../user/user.service";
import {CloudUtilityService} from "./cloud-utility.service";
import * as readdirp from 'readdirp'
import {EntryInfo} from 'readdirp'
import {UserModel} from "../user/model/user.model";
import {PhotoService} from "../photo/photo.service";
import {SyncErrorType} from "./enum/sync-error-type.enum";
import {SyncError} from "./interface/sync-error.interface";
import {createClient, WebDAVClient} from "webdav";
import {dirname, join} from "path";
import {UtilityService} from "../utility/utility.service";

@Injectable()
export class CloudSyncService {

    public state: SyncState

    constructor(
        private cloudUtilityService: CloudUtilityService,
        private utilityService: UtilityService,
        private userService: UserService,
        private photoService: PhotoService
    ) {

        this.state = {
            isSync: false,
            errors: []
        }

    }

    @Cron(CronExpression.EVERY_MINUTE)
    async cron(): Promise<void> {

        if (!eval(process.env.CLOUD_SYNC) || !this.state || this.state.isSync) {
            return
        }

        this.state.isSync = true
        await this.sync()
        this.state.isSync = false

    }

    /**
     * Синхронизация
     */
    async sync(): Promise<void> {

        const userModels: UserModel[] = await this.userService.findSync()

        for (let i: number = 0; i < userModels.length; i++) {

            const userModel = userModels[i]
            const {cloudUsername, cloudPassword, cloudPathScan, cloudPathSync} = userModel
            const fullPathScan = this.cloudUtilityService.getFullUserPath(cloudUsername, cloudPathScan)
            const entryInfos: EntryInfo[] = await readdirp.promise(fullPathScan)
            const webDAVClient = createClient(process.env.NEXTCLOUD_WEBDAV, {
                username: cloudUsername,
                password: cloudPassword
            })

            for (let j: number = 0; j < entryInfos.length; j++) {

                const {path, fullPath} = entryInfos[j]

                try {

                    const {id, mtime} = await this.photoService.create(fullPath, userModel.id)
                    const from = this.generateFrom(cloudUsername, cloudPathScan, path)
                    const to = this.generateTo(cloudUsername, cloudPathSync, mtime, id)

                    await this.move(webDAVClient, from, to)

                } catch (error) {

                    this.addError(error, fullPath)

                }

                const {isSync} = await this.userService.findById(userModel.id)

                if (!isSync) {
                    break
                }

            }

        }

    }

    /**
     * Откуда
     * @param cloudUsername
     * @param cloudPathScan
     * @param path
     */
    generateFrom(cloudUsername: string, cloudPathScan: string, path: string): string {

        return this.utilityService.windowsToPOSIX(
            join(
                'files',
                cloudUsername,
                cloudPathScan,
                path
            )
        )

    }

    /**
     * Куда
     * @param cloudUsername
     * @param cloudPathSync
     * @param mtime
     * @param id
     */
    generateTo(cloudUsername: string, cloudPathSync: string, mtime: Date, id: string): string {

        return this.utilityService.windowsToPOSIX(
            join(
                'files',
                cloudUsername,
                cloudPathSync,
                this.cloudUtilityService.getUserPathSync(mtime),
                this.cloudUtilityService.getFileBase(mtime, id)
            )
        )

    }

    /**
     * Перемещение
     * @param webDAVClient
     * @param from
     * @param to
     */
    async move(webDAVClient: WebDAVClient, from: string, to: string): Promise<void> {

        try {

            await webDAVClient.moveFile(from, to)

        } catch (error) {

            if (error.status === 409) {
                await webDAVClient.createDirectory(dirname(to), {recursive: true})
                await webDAVClient.moveFile(from, to)
                return
            }

            throw new ConflictException(error, 'Что-то пошло не так')

        }

    }

    /**
     * Ошибка
     * @param error
     * @param path
     */
    addError(error, path) {

        const syncError: SyncError = {
            path,
            type: SyncErrorType.SOMETHING_WENT_WRONG
        }

        if (error instanceof BadRequestException) {
            syncError.type = SyncErrorType.DATABASE_DUPLICATE
        }

        if (error instanceof InternalServerErrorException) {
            syncError.type = SyncErrorType.DATABASE_INSERT
        }

        if (error instanceof ConflictException) {
            syncError.type = SyncErrorType.WEBDAV_MOVE
        }

        this.state.errors.push(syncError)
        console.log(error)

    }

}
