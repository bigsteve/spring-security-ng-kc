import { EventEmitter, Output } from "@angular/core";
import { BroadcastService } from "src/app/services/events/broadcast.service";
import { BrowserStorageService } from "src/app/services/storage/browser-storage.service";
import { Utils } from "src/app/utils/utils.model"


export class ModelOperations {

    private _system: {
        storageName: string,
        storageService: BrowserStorageService,
        doNotStore: string[],
        onFilterChange: EventEmitter<any>,
        broadcast: BroadcastService
    } = {
            storageName: 'notNameModelStorage',
            storageService: null,
            doNotStore: ['_system'],
            onFilterChange: new EventEmitter(),
            broadcast: null
        }

    public set storageName(v: string) {
        this.system.storageName = v
        this.copyFromLocalStorage()
    }

    public set storageService(v: BrowserStorageService) {
        this.system.storageService = v
    }

    public set doNotStore(v: string[]) {
        this.system.doNotStore = this.system.doNotStore.concat(v)
    }

    public get system() {
        return this._system
    }



    saveToLocalStorage() {
        localStorage.setItem(this.system.storageName, this.getJson());
    }

    getFromLocalStorage() {
        return localStorage.getItem(this.system.storageName)
    }

    copyFromLocalStorage(): void {

        let storedObj = JSON.parse(localStorage.getItem(this.system.storageName))
        if (!storedObj) return
        Object.keys(storedObj).forEach(k => this[k] = storedObj[k])
    }

    getJson() {

        return JSON.stringify(this, (k, v) => {
            console.log(this.system.doNotStore)
            if (this.system.doNotStore.includes(k)) return undefined
            return v
        })
    }

    getEncodedJson() {
        return new URLSearchParams(this.getJson()).toString()
    }

    getParameterAndEncodedValue(param: string = 'params', q = '?') {
        return q + param + '=' + this.getEncodedJson()
    }

    setValue(k: string, v: any, emitEvent: boolean = true) {

        Utils.setObjectValue(this, k, v)
        this.saveToLocalStorage()
        if (emitEvent) this.emitEvent()
    }

    resetFilter(emitEvent: boolean = true) {
        localStorage.removeItem(this.system.storageName)
        if (emitEvent) this.emitEvent()
    }

    emitEvent() {
        this.system.onFilterChange.emit(this.getJson())
        console.log(this.system.broadcast)
    }



}
