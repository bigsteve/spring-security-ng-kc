import { Pageable } from './pageable/pageable.model'

export class DataPage {

    content: []
    empty: false
    first: false
    last: false
    number: number = 0
    numberOfElements: 0
    pageable: Pageable = new Pageable()
    size: 50
    sort: { sorted: true, unsorted: false, empty: false }
    totalElements: number
    totalPages: 0
    
    public setPageable(v: Pageable) {
        this.pageable = v
    }
    
    public getPageable(): Pageable {
        return this.pageable
    }
}
