import { Injectable } from "@angular/core"
import { BroadcastService } from "src/app/services/events/broadcast.service"
import { BrowserStorageService } from "src/app/services/storage/browser-storage.service"
import { ModelOperations } from "../operations/model-operations.model"


@Injectable({
    providedIn: 'root'
})
export class Filter extends ModelOperations {

    search: object = new Object()
    order: string = ''
    orderdir: 'asc' | 'desc' = 'desc'
    offset: string | Number = 0
    limit: string | Number = 50

    constructor(
        private _broadcastService: BroadcastService,
        private _storageService: BrowserStorageService
    ) {
        super()
        this._system.broadcastService = _broadcastService
        this._system.storageService = _storageService
        delete this._broadcastService
        delete this._storageService

    }

}
