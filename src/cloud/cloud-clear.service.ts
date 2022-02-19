import {Injectable} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {createClient} from "webdav";
import {join} from "path";
import {CloudUtilityService} from "./cloud-utility.service";
import {UtilityService} from "../utility/utility.service";
import {UserService} from "../user/user.service";
import {PhotoService} from "../photo/photo.service";
import {UserModel} from "../user/model/user.model";
import {PhotoModel} from "../photo/model/photo.model";
import {CloudErrorType} from "./enum/cloud-error-type.enum";
import {CloudStateDto} from "./dto/cloud-state.dto";
import {CloudErrorDto} from "./dto/cloud-error.dto";

@Injectable()
export class CloudClearService {

    public state: CloudStateDto

    constructor(
        private cloudUtilityService: CloudUtilityService,
        private utilityService: UtilityService,
        private userService: UserService,
        private photoService: PhotoService
    ) {

        this.state = new CloudStateDto(eval(process.env.CLOUD_CLEAR))

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

        const userModels: UserModel[] = await this.userService.findClear()

        for (let i: number = 0; i < userModels.length; i++) {

            const userModel = userModels[i]
            const photoModels: PhotoModel[] = await this.photoService.findDeleted(userModel.id)

            console.log(userModel.username, photoModels.length)

            if (photoModels.length) {

                const {cloudUsername, cloudPassword, cloudPathSync} = userModel
                const webDAVClient = createClient(process.env.NEXTCLOUD_WEBDAV, {
                    username: cloudUsername,
                    password: cloudPassword
                })

                for (let j: number = 0; j < photoModels.length; j++) {

                    const {id, mtime} = photoModels[j]
                    const filename = this.utilityService.windowsToPOSIX(
                        join(
                            'files',
                            cloudUsername,
                            cloudPathSync,
                            this.cloudUtilityService.getUserPathSync(mtime),
                            this.cloudUtilityService.getFileBase(mtime, id)
                        )
                    )

                    try {

                        await webDAVClient.deleteFile(filename)
                        await this.photoService.remove(id, true)

                    } catch (error) {

                        const cloudErrorDto: CloudErrorDto = new CloudErrorDto(error.message, filename)

                        if (error.status === 404) {
                            cloudErrorDto.type = CloudErrorType.WEBDAV_DELETE
                        }

                        if (error.name === 'SequelizeDatabaseError') {
                            cloudErrorDto.type = CloudErrorType.DATABASE_DELETE
                        }

                        this.state.errors.push(cloudErrorDto)

                    }

                    const {isClear} = await this.userService.findById(userModel.id)

                    if (!isClear) {
                        break
                    }

                }

            }

        }

    }

}
