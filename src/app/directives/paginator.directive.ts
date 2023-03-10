import {
    Directive,
    Host,
    HostListener,
    Optional,
    Renderer2,
    Self,
    ViewContainerRef
} from '@angular/core'

import { MatPaginator, PageEvent } from '@angular/material/paginator'

@Directive({
    selector: '[paginatorDirective]'
})
export class PaginatorDirective {

    // @HostListener('page', ['$event'])
    // onChange(event: PageEvent) {
    //     this.setLabelPage(event.pageIndex + 1)
    // }
    
    private pageLabel: any

    private parentSelector: string = "div.crud-grid"

    constructor(
        @Host() @Self() @Optional() private paginator: MatPaginator,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2
    ) {
        setTimeout(() => {
            this.initpageLabel()
        }, 0)
    }

    private initpageLabel(): void {

        this.pageLabel = this.viewContainerRef.element.nativeElement.closest(this.parentSelector).querySelectorAll(
            'div.mat-paginator-range-actions > div.mat-paginator-range-label'
        )
        const lastButton = this.viewContainerRef.element.nativeElement.closest(this.parentSelector).querySelector(
            '.mat-paginator button.mat-paginator-navigation-last'
        )
        this.renderer.setAttribute(lastButton, 'hidden', 'true')
        
        this.setLabelPage(this.paginator.pageIndex + 1)
    }


    public setParentSelector(v: string) {
        this.parentSelector = v
    }


    /**
     * Usage:
     * 
     * this.getObjectValue(this, 'paginator').__ngContext__
     * .filter(n => n != null && n.hasOwnProperty('setLabelPage'))
     * .forEach(el =>  el.setLabelPage(+this.filter.offset + 1))
     * 
     * @param v 
     */
    public setLabelPage = (v: number) => {
        for(let el of this.pageLabel) el.innerHTML = 'Page ' + v
    }


}


