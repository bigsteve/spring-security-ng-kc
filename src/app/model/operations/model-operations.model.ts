import { EventEmitter } from "@angular/core";
import { BroadcastService } from "src/app/services/events/broadcast.service";
import { BrowserStorageService } from "src/app/services/storage/browser-storage.service";
import { Utils } from "src/app/utils/utils.model"

/**
 * Provides methods to observe and use model properties changes
 */
export class ModelOperations {

    protected _system: {
        initialValues: string,
        storageName: string,
        storageService: BrowserStorageService,
        doNotStore: string[],
        onFilterChange: EventEmitter<any>,
        broadcastService: BroadcastService
    } = {
            initialValues: null,
            storageName: 'storageNameNotSet',
            storageService: null,
            doNotStore: ['_system'],
            onFilterChange: new EventEmitter(),
            broadcastService: null
        }

    public get system() {
        return this._system
    }

    public set storageName(v: string) {
        this.system.storageName = v
        this.system.initialValues = this.getJsonAllowedToStore()
        this.copyFromLocalStorage()
    }

    public get storageName(): string {
        return this.system.storageName
    }

    public set storageService(v: BrowserStorageService) {
        this.system.storageService = v
    }

    public get storageService(): BrowserStorageService {
        return this.system.storageService
    }

    public set doNotStore(v: string[]) {
        this.system.doNotStore = this.doNotStore.concat(v)
    }

    public get doNotStore(): string[] {
        return this.system.doNotStore
    }

    public get onFilterChange(): EventEmitter<any> {
        return this.system.onFilterChange
    }

    public set broadcastService(v: BroadcastService) {
        this.system.broadcastService = v
    }

    public get broadcastService(): BroadcastService {
        return this.system.broadcastService
    }

    saveToLocalStorage() {
        this.storageService.set(this.storageName, this.getJsonAllowedToStore());
    }

    getFromLocalStorage() {
        return this.storageService.get(this.storageName)
    }

    copyFromLocalStorage(): void {

        let storedObj = JSON.parse(this.storageService.get(this.storageName))
        if (!storedObj) return
        Object.keys(storedObj).forEach(k => this[k] = storedObj[k])
    }

    getJsonAllowedToStore() {

        return JSON.stringify(this, (k, v) => {
            if (this.doNotStore.includes(k)) return undefined
            return v
        })
    }

    getJson() {

        return JSON.stringify(this, (k, v) => { return (k === '_system') ? undefined : v })
    }

    getEncodedJson() {
        return new URLSearchParams(this.getJson()).toString()
    }
    /**
     * Returns all filter parameters as encoded json to be passed on request
     * @param param 
     * @param q 
     * @returns 
     */
    getParameterAndEncodedValue(param: string = 'params', q = '?') {
        return q + param + '=' + this.getEncodedJson()
    }

    setValue(k: string, v: any, emitEvent: boolean = true) {
        Utils.setObjectValue(this, k, v)
        this.saveToLocalStorage()
        if (emitEvent) this.emitEvent()
    }

    resetFilter(emitEvent: boolean = true) {
        let obj = JSON.parse(this.system.initialValues)
        Object.keys(obj).forEach(k => this[k] = obj[k])
        this.storageService.set(this.storageName, this.system.initialValues);
        if (emitEvent) this.emitEvent()
    }

    emitEvent() {
        this.onFilterChange.emit(this.getJson())
    }
}
