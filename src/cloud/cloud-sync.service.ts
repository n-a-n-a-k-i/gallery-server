import {Injectable} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {SyncState} from "./interface/sync-state.interface";
import {UserService} from "../user/user.service";
import {CloudUtilityService} from "./cloud-utility.service";
import * as readdirp from 'readdirp'

@Injectable()
export class CloudSyncService {

    public state: SyncState

    constructor(
        private userService: UserService,
        private cloudUtilityService: CloudUtilityService
    ) {

        this.state = {
            isSync: false,
            errors: []
        }

    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async cron(): Promise<void> {

        if (this.state.isSync) {
            return
        }

        this.state.isSync = true
        await this.sync()
        // this.state.isSync = false

    }

    async sync(): Promise<void> {

        const userModels = await this.userService.findSync()

        for (let i = 0; i < userModels.length; i++) {

            const userModel = userModels[i]
            const {cloudUsername, cloudPathScan} = userModel
            const fullPathScan = this.cloudUtilityService.getFullUserPath(cloudUsername, cloudPathScan)
            const temp = await readdirp.promise(fullPathScan, {
                alwaysStat: true
            })

            console.log(temp[0])

        }

    }

}
