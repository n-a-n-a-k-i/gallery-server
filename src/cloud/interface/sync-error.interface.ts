import {SyncErrorType} from "../enum/sync-error-type.enum";

export interface SyncError {
    path: string
    type: SyncErrorType
}
