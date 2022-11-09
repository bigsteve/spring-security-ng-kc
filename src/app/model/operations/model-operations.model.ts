import { EventEmitter, Output } from "@angular/core";
import { Utils } from "src/app/utils/utils.model"

export class ModelOperations {

    public onFilterChange: EventEmitter<any> = new EventEmitter();
    private storageName: string = 'modelStorage'


    constructor(storageName?: string) {
        this.storageName = storageName + 'zz'
    }

    saveToLocalStorage() {
        localStorage.setItem(this.storageName, this.getJson());
    }

    getFromLocalStorage() {
        return localStorage.getItem(this.storageName)
    }

    getJson() {

        return JSON.stringify(this, (k, v) => {
            if (k === 'storageName' || k === 'onFilterChange') return undefined
            return v
        })
    }

    getEncodedJson() {
        return new URLSearchParams(this.getJson()).toString()
    }

    getParameterAndEncodedValue(param: String = 'params', q = '?') {
        return q + param + '=' + this.getEncodedJson()
    }

    setValue(k: String, v: any, emitEvent: boolean = true) {

        Utils.setObjectValue(this, k, v)
        this.saveToLocalStorage()
        if (emitEvent) this.emitEvent()
    }

    emitEvent() {
        this.onFilterChange.emit(this.getJson())
    }


}
