"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var layout_component_1 = require("./layout.component");
var routes = [
    {
        path: '',
        component: layout_component_1.LayoutComponent,
        children: [
            { path: '', redirectTo: 'explore' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'explore', loadChildren: './explore/explore.module#ExploreModule' },
            { path: 'store-app', loadChildren: './store-app/store-app.module#StoreAppModule' },
            { path: 'all-app', loadChildren: './all-app/all-app.module#AllAppModule' }
        ]
    }
];
var LayoutRoutingModule = /** @class */ (function () {
    function LayoutRoutingModule() {
    }
    LayoutRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.NativeScriptRouterModule.forChild(routes)],
            exports: [router_1.NativeScriptRouterModule]
        })
    ], LayoutRoutingModule);
    return LayoutRoutingModule;
}());
exports.LayoutRoutingModule = LayoutRoutingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LnJvdXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXlvdXQucm91dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUN6QyxzREFBdUU7QUFFdkUsdURBQXFEO0FBRXJELElBQU0sTUFBTSxHQUFXO0lBQ25CO1FBQ0ksSUFBSSxFQUFFLEVBQUU7UUFDUixTQUFTLEVBQUUsa0NBQWU7UUFDMUIsUUFBUSxFQUFFO1lBQ04sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUU7WUFDbkMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSw4Q0FBOEMsRUFBRTtZQUNuRixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLHdDQUF3QyxFQUFFO1lBQzNFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsNkNBQTZDLEVBQUU7WUFDbEYsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSx1Q0FBdUMsRUFBRTtTQUM3RTtLQUNKO0NBQ0osQ0FBQztBQU1GO0lBQUE7SUFBbUMsQ0FBQztJQUF2QixtQkFBbUI7UUFKL0IsZUFBUSxDQUFDO1lBQ04sT0FBTyxFQUFFLENBQUMsaUNBQXdCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELE9BQU8sRUFBRSxDQUFDLGlDQUF3QixDQUFDO1NBQ3RDLENBQUM7T0FDVyxtQkFBbUIsQ0FBSTtJQUFELDBCQUFDO0NBQUEsQUFBcEMsSUFBb0M7QUFBdkIsa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IFJvdXRlcyB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgTGF5b3V0Q29tcG9uZW50IH0gZnJvbSAnLi9sYXlvdXQuY29tcG9uZW50JztcclxuXHJcbmNvbnN0IHJvdXRlczogUm91dGVzID0gW1xyXG4gICAge1xyXG4gICAgICAgIHBhdGg6ICcnLFxyXG4gICAgICAgIGNvbXBvbmVudDogTGF5b3V0Q29tcG9uZW50LFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHsgcGF0aDogJycsIHJlZGlyZWN0VG86ICdleHBsb3JlJyB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdkYXNoYm9hcmQnLCBsb2FkQ2hpbGRyZW46ICcuL2Rhc2hib2FyZC9kYXNoYm9hcmQubW9kdWxlI0Rhc2hib2FyZE1vZHVsZScgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiAnZXhwbG9yZScsIGxvYWRDaGlsZHJlbjogJy4vZXhwbG9yZS9leHBsb3JlLm1vZHVsZSNFeHBsb3JlTW9kdWxlJyB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdzdG9yZS1hcHAnLCBsb2FkQ2hpbGRyZW46ICcuL3N0b3JlLWFwcC9zdG9yZS1hcHAubW9kdWxlI1N0b3JlQXBwTW9kdWxlJyB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdhbGwtYXBwJywgbG9hZENoaWxkcmVuOiAnLi9hbGwtYXBwL2FsbC1hcHAubW9kdWxlI0FsbEFwcE1vZHVsZScgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxuXTtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvckNoaWxkKHJvdXRlcyldLFxyXG4gICAgZXhwb3J0czogW05hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIExheW91dFJvdXRpbmdNb2R1bGUgeyB9Il19