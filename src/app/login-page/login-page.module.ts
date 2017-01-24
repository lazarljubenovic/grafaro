import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginPageComponent} from './login-page.component';
import {RouterModule} from '@angular/router';
import {CoreModule} from '../core/core.module';
import {UserService} from './user.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CoreModule,
    ],
    declarations: [
        LoginPageComponent,
    ],
    providers: [
        UserService,
    ],
})
export class LoginPageModule {
}
