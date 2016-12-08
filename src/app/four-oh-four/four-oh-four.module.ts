import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FourOhFourComponent} from './four-oh-four.component';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
    ],
    declarations: [
        FourOhFourComponent,
    ],
})
export class FourOhFourModule {
}
