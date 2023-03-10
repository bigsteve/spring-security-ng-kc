import { EventEmitter } from "@angular/core";
import { BroadcastService } from "src/app/services/events/broadcast.service";
import { BrowserStorageService } from "src/app/services/storage/browser-storage.service";
import { Utils } from "src/app/utils/utils.model"

/**
 * Provides methods to manage and use grid filter properties
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

        let storedObj = JSON.parse(this.getFromLocalStorage())
        if (!storedObj) return
        Utils.deepCopyObjectWhereTargetKeysExistPlusExtraKeys(this, storedObj, ['order'])
    }

    getJsonAllowedToStore() {

        return JSON.stringify(this, (k, v) => {
            if (this.doNotStore.includes(k)) return (k === '_system') ? undefined : ''
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
    getParameterAndEncodedValue(q: string = '?', param: string = 'params') {
        return q + param + '=' + this.getEncodedJson()
    }

    setValue(k: string, v: any, emitEvent: boolean = true) {
        Utils.setObjectValue(this, k, v)
        this.saveToLocalStorage()
        if (emitEvent) this.emitEvent()
    }

    getValue(k: string) {
        return Utils.getObjectValue(this, k)
    }


    setInitialValue(k: string, v: any, emitEvent: boolean = true) {
        Utils.setObjectValue(this, k, v)
    }

    resetFilter(emitEvent: boolean = true) {
        Utils.deepCopyObjectWhereTargetKeysExistPlusExtraKeys(this, JSON.parse(this.system.initialValues), ['order'])
        this.storageService.set(this.storageName, this.system.initialValues);
        if (emitEvent) this.emitEvent()
    }

    emitEvent() {
        this.onFilterChange.emit({name: 'filter', event: JSON.parse(this.getJson())})
    }
}
