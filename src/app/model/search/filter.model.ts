import { ModelOperations } from "../operations/model-operations.model"

export class Filter extends ModelOperations {

    search: any = {}
    order: string = 'createdAt'
    orderdir: 'asc' | 'desc' = 'desc'
    offset: string | Number = 0
    limit: string | Number = 50

    constructor(storageName: string, doNotStore: string[] = []) {
        super(storageName, doNotStore)
        this.copyFromLocalStorage()
    }

}
