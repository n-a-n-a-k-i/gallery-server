import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {createClient} from "webdav";
import {dirname, join} from "path";
import * as readdirp from 'readdirp'
import {EntryInfo} from 'readdirp'
import {CloudUtilityService} from "./cloud-utility.service";
import {UtilityService} from "../utility/utility.service";
import {UserService} from "../user/user.service";
import {PhotoService} from "../photo/photo.service";
import {UserModel} from "../user/model/user.model";
import {CloudErrorType} from "./enum/cloud-error-type.enum";
import {CloudStateDto} from "./dto/cloud-state.dto";
import {CloudErrorDto} from "./dto/cloud-error.dto";

@Injectable()
export class CloudSyncService {

    public state: CloudStateDto

    constructor(
        private cloudUtilityService: CloudUtilityService,
        private utilityService: UtilityService,
        private userService: UserService,
        private photoService: PhotoService
    ) {

        this.state = new CloudStateDto(eval(process.env.CLOUD_SYNC))

    }

    @Cron(CronExpression.EVERY_MINUTE)
    async cron(): Promise<void> {

        this.state.i++

        if (!this.state.isEnabled || this.state.isLoop) {
            return
        }

        this.state.isLoop = true
        await this.loop()
        this.state.isLoop = false

    }

    async loop(): Promise<void> {

        const userModels: UserModel[] = await this.userService.findSync()

        for (let i: number = 0; i < userModels.length; i++) {

            const userModel = userModels[i]
            const {cloudUsername, cloudPassword, cloudPathScan, cloudPathSync} = userModel
            const fullPathScan = this.cloudUtilityService.getFullUserPath(cloudUsername, cloudPathScan)
            const entryInfos: EntryInfo[] = await readdirp.promise(fullPathScan, {
                fileFilter: [
                    '*.jpg',
                    '*.JPG'
                ]
            })
            const webDAVClient = createClient(process.env.NEXTCLOUD_WEBDAV, {
                username: cloudUsername,
                password: cloudPassword
            })

            for (let j: number = 0; j < entryInfos.length; j++) {

                const {path, fullPath} = entryInfos[j]

                try {

                    const {id, mtime} = await this.photoService.create(fullPath, userModel.id)
                    const from = this.utilityService.windowsToPOSIX(
                        join(
                            'files',
                            cloudUsername,
                            cloudPathScan,
                            path
                        )
                    )
                    const to = this.utilityService.windowsToPOSIX(
                        join(
                            'files',
                            cloudUsername,
                            cloudPathSync,
                            this.cloudUtilityService.getUserPathSync(mtime),
                            this.cloudUtilityService.getFileBase(mtime, id)
                        )
                    )

                    try {

                        await webDAVClient.moveFile(from, to)

                    } catch (error) {

                        if (error.status !== 409) {
                            throw error
                        }

                        await webDAVClient.createDirectory(dirname(to), {recursive: true})
                        await webDAVClient.moveFile(from, to)

                    }

                } catch (error) {

                    const cloudErrorDto: CloudErrorDto = new CloudErrorDto(error.message, fullPath)

                    if (error instanceof BadRequestException) {
                        cloudErrorDto.type = CloudErrorType.DATABASE_DUPLICATE
                    }

                    if (error instanceof InternalServerErrorException) {
                        cloudErrorDto.type = CloudErrorType.DATABASE_INSERT
                    }

                    this.state.errors.push(cloudErrorDto)

                }

                const {isSync} = await this.userService.findById(userModel.id)

                if (!isSync) {
                    break
                }

            }

        }

    }

}
