import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {VisGraphModule} from "@lazarljubenovic/vis-ng/core";
import {StepperModule} from "./shared/stepper/stepper.module";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        VisGraphModule,
        StepperModule,
    ],
    providers: [],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
