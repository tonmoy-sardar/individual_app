"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var router_2 = require("@angular/router");
var auth_guard_1 = require("./core/guard/auth.guard");
var routes = [
    { path: "login", loadChildren: "./login/login.module#LoginModule" },
    { path: "signup", loadChildren: "./signup/signup.module#SignupModule" },
    { path: "forgot-password", loadChildren: "./forgot-password/forgot-password.module#ForgotPasswordModule" },
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [auth_guard_1.AuthGuard] },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.NativeScriptRouterModule.forRoot(routes, { preloadingStrategy: router_2.PreloadAllModules })],
            exports: [router_1.NativeScriptRouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAucm91dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUN6QyxzREFBdUU7QUFDdkUsMENBQTREO0FBQzVELHNEQUFvRDtBQUVwRCxJQUFNLE1BQU0sR0FBVztJQUNuQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLGtDQUFrQyxFQUFFO0lBQ25FLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUscUNBQXFDLEVBQUU7SUFDdkUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLCtEQUErRCxFQUFFO0lBQzFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUscUNBQXFDLEVBQUUsV0FBVyxFQUFFLENBQUMsc0JBQVMsQ0FBQyxFQUFFO0NBQzlGLENBQUM7QUFNRjtJQUFBO0lBQWdDLENBQUM7SUFBcEIsZ0JBQWdCO1FBSjVCLGVBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRSxDQUFDLGlDQUF3QixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSwwQkFBaUIsRUFBRSxDQUFDLENBQUM7WUFDOUYsT0FBTyxFQUFFLENBQUMsaUNBQXdCLENBQUM7U0FDdEMsQ0FBQztPQUNXLGdCQUFnQixDQUFJO0lBQUQsdUJBQUM7Q0FBQSxBQUFqQyxJQUFpQztBQUFwQiw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUm91dGVzLCBQcmVsb2FkQWxsTW9kdWxlcyB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgQXV0aEd1YXJkIH0gZnJvbSAnLi9jb3JlL2d1YXJkL2F1dGguZ3VhcmQnO1xyXG5cclxuY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBbXHJcbiAgICB7IHBhdGg6IFwibG9naW5cIiwgbG9hZENoaWxkcmVuOiBcIi4vbG9naW4vbG9naW4ubW9kdWxlI0xvZ2luTW9kdWxlXCIgfSxcclxuICAgIHsgcGF0aDogXCJzaWdudXBcIiwgbG9hZENoaWxkcmVuOiBcIi4vc2lnbnVwL3NpZ251cC5tb2R1bGUjU2lnbnVwTW9kdWxlXCIgfSxcclxuICAgIHsgcGF0aDogXCJmb3Jnb3QtcGFzc3dvcmRcIiwgbG9hZENoaWxkcmVuOiBcIi4vZm9yZ290LXBhc3N3b3JkL2ZvcmdvdC1wYXNzd29yZC5tb2R1bGUjRm9yZ290UGFzc3dvcmRNb2R1bGVcIiB9LFxyXG4gICAgeyBwYXRoOiAnJywgbG9hZENoaWxkcmVuOiAnLi9sYXlvdXQvbGF5b3V0Lm1vZHVsZSNMYXlvdXRNb2R1bGUnLCBjYW5BY3RpdmF0ZTogW0F1dGhHdWFyZF0gfSxcclxuXTtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3Qocm91dGVzLCB7IHByZWxvYWRpbmdTdHJhdGVneTogUHJlbG9hZEFsbE1vZHVsZXMgfSldLFxyXG4gICAgZXhwb3J0czogW05hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcFJvdXRpbmdNb2R1bGUgeyB9Il19