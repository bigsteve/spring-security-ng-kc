export class Pageable {

    public sort: {
        sorted: boolean,
        unsorted: boolean,
        empty: boolean
    } = {
        sorted: false,
        unsorted: true,
        empty: true
    }

    protected pageSizeOptions: number[] = [50, 100, 150, 250, 500]
    public offset: number = 0
    public pageNumber: number = 0
    public pageSize: number = this.pageSizeOptions[0]
    public unpaged: boolean = false
    public paged: boolean = true

    constructor(pageable?: {
        offset: number, pageNumber: number, unpaged: boolean, paged: boolean,
        sort: { sorted: boolean, unsorted: boolean, empty: boolean },
        pageSize: number
    }) {
        this.setPageable(pageable)
    }

    public setPageable(pageable?: {
        offset: number, pageNumber: number, unpaged: boolean, paged: boolean,
        sort: { sorted: boolean, unsorted: boolean, empty: boolean },
        pageSize: number
    }) {
        this.offset = pageable?.offset ?? this.offset
        this.pageNumber = pageable?.pageNumber ?? this.pageNumber
        this.unpaged = pageable?.unpaged ?? this.unpaged
        this.paged = pageable?.paged ?? this.paged
        this.sort = pageable?.sort ?? this.sort
        this.pageSize = pageable?.pageSize ?? this.pageSize
    }

    public setPageSizeOptions(options: number[]): void {
        this.pageSizeOptions = options
    }

    public getPageSizeOptions(): number[] {
        return this.pageSizeOptions
    }

    public setPageSize(v: number) {
        if(v) this.pageSize = v
    }

    public getPageSize(): number {
        return this.pageSize
    }


    public setOffset(v: number) {
        if(v) this.offset = v
    }

    public getOffset(): number {
        return this.offset
    }

    public getRequestParameters(): string {
        return "limit=" + this.pageSize + "&offset=" + this.pageNumber
    }

}
