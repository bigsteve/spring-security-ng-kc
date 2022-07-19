export class Column {

    key: string
    title: string
    placeholder: string = ""
    cellTemplate: string = "defaultCellTemplate"
    orderEnabled: boolean = true
    searchEnabled: boolean = true

    constructor (obj: Object) {
        Object.keys(obj).forEach(key => this[key] = obj[key])
    }
}
