import { Injectable } from "@angular/core"
import { Console } from "console"
import { BroadcastService } from "src/app/services/events/broadcast.service"
import { BrowserStorageService } from "src/app/services/storage/browser-storage.service"
import { ModelOperations } from "../operations/model-operations.model"


@Injectable({
    providedIn: 'root'
})
export class Filter extends ModelOperations {

    search: object = new Object()
    order: { by: string[], dir: string[] } = { by: [], dir: [] }
    offset: string | number = 0
    limit: string | number = 50

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


    getLastSort() {
        for(let i = this.order.by.length - 1; i >= 0; i--) {
            return {by: this.order.by[i], dir: this.order.dir[i]}
        }
        return { by: null, dir: null }
    }

    

    setOneSort(k: string, v: any, emitEvent: boolean = true) {
        this.order.by[0] = k
        this.order.dir[0] = v
        if(!k.length || !v.length) {
            this.order.by = []
            this.order.dir = []
        }
        this.saveToLocalStorage()
        if (emitEvent) this.emitEvent()
    }

    

    setLastSort(k: string, v: any, emitEvent: boolean = true) {
        // not implemented
        this.saveToLocalStorage()
        if (emitEvent) this.emitEvent()
    }

}
 