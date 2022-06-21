import { Pageable } from './pageable/pageable.model'

export class Page {

    content: []
    empty: false
    first: false
    last: false
    number: 0
    numberOfElements: 0
    pageable: Pageable = new Pageable()
    size: 50
    sort: { sorted: true, unsorted: false, empty: false }
    totalElements: 0
    totalPages: 0
}
