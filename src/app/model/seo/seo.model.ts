export class Seo {

    public title: string
    public subtitle: string
    public description: string
    public keywords: string[]
    public sitemap: string = "sitemap.xml"

    public getKeywords() {
        return this.keywords.join(",")
    }
}
