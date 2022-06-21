export class Pageable {

    public sort: {
        sorted: boolean,
        unsorted: boolean,
        empty: boolean
    }

    private pageSizeOptions: number[] = [50, 100, 150, 250, 500]
    public offset: number = 0
    public pageNumber: number = 0
    public pageSize: number = this.pageSizeOptions[0]
    public unpaged: boolean = false
    public paged: boolean = true


    constructor(offset: number = 0, pageNumber: number = 0, unpaged: boolean = false, paged: boolean = true, sort: {
        sorted: boolean,
        unsorted: boolean,
        empty: boolean
    } = {
            sorted: true,
            unsorted: false,
            empty: false
        }) {
        this.sort = sort
        this.offset = 0
        this.pageNumber = 0
        this.unpaged = false
        this.paged = true
        this.pageSize = this.pageSizeOptions[0]
    }

    public setPageSizeOptions(options: number[]): void {
        this.pageSizeOptions = options
    }

    public getPageSizeOptions(): number[] {
        return this.pageSizeOptions
    }

}
