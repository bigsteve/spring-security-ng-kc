import { EventEmitter, Output } from "@angular/core";
import { Utils } from "src/app/utils/utils.model"

export class ModelOperations {

    private system: {
        storageName: string,
        doNotStore: string[],
        onFilterChange: EventEmitter<any>
    } = {
            storageName: 'modelStorage',
            doNotStore: [],
            onFilterChange: new EventEmitter()
        }


    constructor(storageName: string, doNotStore: string[] = []) {
        this.system.storageName = storageName
        this.system.doNotStore = doNotStore
        this.system.doNotStore.push('system')
    }


    getSystem() {
        return this.system
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
            if (k === 'system' || this.system.doNotStore.includes(k)) return undefined
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

    emitEvent() {
        this.system.onFilterChange.emit(this.getJson())
    }



}
