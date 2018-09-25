import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { LayoutComponent } from './layout.component';
import * as Globals from '../core/globals';


const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'store-app/'+Globals.staticAppID+'/about-us' },
            { path: 'store-app', loadChildren: './store-app/store-app.module#StoreAppModule' },
        ]
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class LayoutRoutingModule { }