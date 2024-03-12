import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    isDevMode,
    ViewContainerRef,
    Renderer2,
    Output,
    ElementRef
} from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { DataPage } from 'src/app/model/data.page.model'
import { Pageable } from 'src/app/model/pageable/pageable.model'
import { MatPaginator } from '@angular/material/paginator'
import { Seo } from 'src/app/model/seo/seo.model'
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip'
import { Utils } from 'src/app/utils/utils.model'
import { Filter } from 'src/app/model/search/filter.model'
import { MatDialog } from '@angular/material/dialog'
import { MatTable } from '@angular/material/table'
import { GridmasterComponent } from './gridmaster.component'

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Filter]
})
export class GridComponent extends GridmasterComponent {

    // ngOnInit(){
    //     super.ngOnInit()
    // }
}
