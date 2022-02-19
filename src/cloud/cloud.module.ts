import {forwardRef, Module} from "@nestjs/common";
import {UserModule} from "../user/user.module";
import {UtilityModule} from "../utility/utility.module";
import {PhotoModule} from "../photo/photo.module";
import {CloudController} from "./cloud.controller";
import {CloudUtilityService} from "./cloud-utility.service";
import {CloudSyncService} from "./cloud-sync.service";
import {CloudClearService} from "./cloud-clear.service";

@Module({
    controllers: [CloudController],
    providers: [
        CloudUtilityService,
        CloudSyncService,
        CloudClearService
    ],
    imports: [
        UserModule,
        UtilityModule,
        forwardRef(() => PhotoModule)
    ],
    exports: [
        CloudUtilityService
    ]
})
export class CloudModule {}
