import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NSModuleFactoryLoader } from "nativescript-angular/router";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        CoreModule,
        CoreModule.forRoot(),
        // AgmCoreModule.forRoot({
        //     apiKey: 'AIzaSyB3FKbaqonmY-bDPanbzJSH9U7HXF8dpS4',
        //     libraries: ['places']

        // })
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        { provide: NSModuleFactoryLoader, useClass: NSModuleFactoryLoader }
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
