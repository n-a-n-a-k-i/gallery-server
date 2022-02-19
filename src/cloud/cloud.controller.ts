import {Controller, Get} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CloudSyncService} from "./cloud-sync.service";
import {CloudClearService} from "./cloud-clear.service";
import {CloudStateDto} from "./dto/cloud-state.dto";

@ApiTags('Облако')
@Controller('cloud')
export class CloudController {

    constructor(
        private cloudSyncService: CloudSyncService,
        private cloudClearService: CloudClearService
    ) {}

    @ApiOperation({summary: 'Состояние синхронизации'})
    @ApiResponse({type: CloudStateDto})
    @ApiBearerAuth('accessToken')
    @Get('sync')
    async getSyncState(): Promise<CloudStateDto> {

        return this.cloudSyncService.state

    }

    @ApiOperation({summary: 'Состояние очистки'})
    @ApiResponse({type: CloudStateDto})
    @ApiBearerAuth('accessToken')
    @Get('clear')
    async getClearState(): Promise<CloudStateDto> {

        return this.cloudClearService.state

    }

}
