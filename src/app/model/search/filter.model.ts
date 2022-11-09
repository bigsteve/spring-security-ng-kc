import { ModelOperations } from "../operations/model-operations.model"

export class Filter extends ModelOperations {

    search: {} = {}
    sort: String = 'createdAt'
    sortdir: 'asc' | 'desc' = 'desc'
    offset: String | Number = 0
    limit: String | Number = 50

}
