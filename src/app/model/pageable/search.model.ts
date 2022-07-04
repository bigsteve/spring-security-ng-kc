export class Search {

    protected orderby: string = ""
    protected orderdir: string = ""
    protected searchby: string = ""
    protected search: string = ""

    public setOrderBy(v: string): void {
        this.orderby = (v !== undefined) ? v : this.orderby
    }

    public setOrderDir(v: string): void {
        this.orderdir = (v !== undefined) ? v : this.orderdir
    }

    public setSearchBy(v: string): void {
        this.searchby = (v !== undefined) ? v : this.searchby
    }

    public setSearch(v: string): void {
        this.search = (v !== undefined) ? v : this.search
    }

    public getRequestParameters(): string {
        return Object.keys(this).map(key => `${key}=${this[key]}`).join('&');
    }

}
