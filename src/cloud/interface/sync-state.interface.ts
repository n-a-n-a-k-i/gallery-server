import {SyncError} from "./sync-error.interface";

export interface SyncState {
    isSync: boolean
    errors: SyncError[]
}
