import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes, PreloadAllModules } from "@angular/router";
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
    { path: "login", loadChildren: "./login/login.module#LoginModule" },
    { path: "signup", loadChildren: "./signup/signup.module#SignupModule" },
    { path: "forgot-password", loadChildren: "./forgot-password/forgot-password.module#ForgotPasswordModule" },
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }