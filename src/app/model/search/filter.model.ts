export class Filter {

    search: {} = {}
    sort: String = 'createdAt'
    sortdir: 'asc' | 'desc' = 'desc'
    offset: String | Number = 0
    limit: String | Number = 50
}
