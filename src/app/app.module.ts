import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, RequestOptions, Http} from '@angular/http';
import {AppComponent} from './app.component';
import {StepperModule} from './shared/stepper/stepper.module';
import {RoomViewModule} from './room-view/room-view.module';
import {MarkdownService} from './shared/markdown.service';
import {EmojiService} from './shared/emoji.service';
import {GraphOptionsService} from './graph-options.service';
import {RoomBrowserModule} from './room-browser/room-browser.module';
import {FourOhFourModule} from './four-oh-four/four-oh-four.module';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {LoginPageModule} from './login-page/login-page.module';
import {NotifyService} from './algorithm/notify.service';
import {GraphManager} from './managers/graph.manager';
import {RoutesModule} from './routes/routes.module';
import {ALGORITHMS} from './algorithms/index';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({}), http, options);
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StepperModule,
        RoomViewModule.forRoot(ALGORITHMS),
        RoomBrowserModule,
        FourOhFourModule,
        LoginPageModule,
        RoutesModule,
    ],
    providers: [
        MarkdownService,
        EmojiService,
        GraphOptionsService,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions],
        },
        NotifyService,
        GraphManager,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
