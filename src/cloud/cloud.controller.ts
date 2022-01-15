import {CloudSyncService} from "./cloud-sync.service";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";
import {SyncState} from "./interface/sync-state.interface";

@ApiTags('Облако')
@Controller('cloud')
export class CloudController {

    constructor(
        private cloudSyncService: CloudSyncService
    ) {}

    @ApiOperation({summary: 'Состояние синхронизации'})
    @ApiBearerAuth('accessToken')
    @Get('sync')
    async getSyncState(): Promise<SyncState> {

        return this.cloudSyncService.state

    }

}
