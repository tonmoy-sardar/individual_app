import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { LayoutRoutingModule } from './layout.routing';
import { LayoutComponent } from './layout.component';

import { CoreModule } from "../core/core.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        LayoutRoutingModule,
        CoreModule
    ],
    declarations: [
        LayoutComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class LayoutModule { }
