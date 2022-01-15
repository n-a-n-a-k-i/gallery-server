import {Module} from "@nestjs/common";
import {CloudSyncService} from "./cloud-sync.service";
import {UserModule} from "../user/user.module";
import {CloudController} from "./cloud.controller";
import {CloudUtilityService} from "./cloud-utility.service";
import {UtilityModule} from "../utility/utility.module";

@Module({
    controllers: [CloudController],
    providers: [
        CloudSyncService,
        CloudUtilityService
    ],
    imports: [
        UserModule,
        UtilityModule
    ],
    exports: [
        CloudUtilityService
    ]
})
export class CloudModule {}
