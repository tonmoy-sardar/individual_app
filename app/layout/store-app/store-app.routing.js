"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var store_app_component_1 = require("./store-app.component");
var products_component_1 = require("./products/products.component");
var contact_us_component_1 = require("./contact-us/contact-us.component");
var about_us_component_1 = require("./about-us/about-us.component");
var cart_component_1 = require("./cart/cart.component");
var payment_component_1 = require("./payment/payment.component");
var messenger_component_1 = require("./messenger/messenger.component");
var payment_success_component_1 = require("./payment-success/payment-success.component");
var order_list_component_1 = require("./order-list/order-list.component");
var my_account_component_1 = require("./my-account/my-account.component");
var routes = [
    {
        path: ':id',
        component: store_app_component_1.StoreAppComponent,
        children: [
            { path: "about-us", component: about_us_component_1.StoreAppAboutUsComponent },
            { path: "products", component: products_component_1.StoreAppProductsComponent },
            { path: "contact-us", component: contact_us_component_1.StoreAppContactUsComponent },
            { path: "cart", component: cart_component_1.StoreAppCartComponent },
            { path: "payment", component: payment_component_1.StoreAppPaymentComponent },
            { path: "messenger", component: messenger_component_1.StoreAppMessengerComponent },
            { path: "payment-success/:order", component: payment_success_component_1.StoreAppPaymentSuccessComponent },
            { path: "order-list", component: order_list_component_1.StoreAppOrderListComponent },
            { path: "my-account", component: my_account_component_1.StoreAppMyAccountComponent }
        ]
    }
];
var StoreAppRoutingModule = /** @class */ (function () {
    function StoreAppRoutingModule() {
    }
    StoreAppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.NativeScriptRouterModule.forChild(routes)],
            exports: [router_1.NativeScriptRouterModule]
        })
    ], StoreAppRoutingModule);
    return StoreAppRoutingModule;
}());
exports.StoreAppRoutingModule = StoreAppRoutingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUtYXBwLnJvdXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdG9yZS1hcHAucm91dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUV6QyxzREFBdUU7QUFFdkUsNkRBQTBEO0FBQzFELG9FQUEwRTtBQUMxRSwwRUFBK0U7QUFDL0Usb0VBQXlFO0FBQ3pFLHdEQUE4RDtBQUM5RCxpRUFBdUU7QUFDdkUsdUVBQTZFO0FBQzdFLHlGQUE4RjtBQUM5RiwwRUFBK0U7QUFDL0UsMEVBQStFO0FBQy9FLElBQU0sTUFBTSxHQUFXO0lBQ25CO1FBQ0ksSUFBSSxFQUFFLEtBQUs7UUFDWCxTQUFTLEVBQUUsdUNBQWlCO1FBQzVCLFFBQVEsRUFBRTtZQUNOLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsNkNBQXdCLEVBQUU7WUFDekQsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSw4Q0FBeUIsRUFBRTtZQUMxRCxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGlEQUEwQixFQUFFO1lBQzdELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsc0NBQXFCLEVBQUU7WUFDbEQsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSw0Q0FBd0IsRUFBRTtZQUN4RCxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGdEQUEwQixFQUFFO1lBQzVELEVBQUUsSUFBSSxFQUFFLHdCQUF3QixFQUFFLFNBQVMsRUFBRSwyREFBK0IsRUFBRTtZQUM5RSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGlEQUEwQixFQUFFO1lBQzdELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsaURBQTBCLEVBQUU7U0FDaEU7S0FDSjtDQUVKLENBQUM7QUFNRjtJQUFBO0lBQXFDLENBQUM7SUFBekIscUJBQXFCO1FBSmpDLGVBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRSxDQUFDLGlDQUF3QixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRCxPQUFPLEVBQUUsQ0FBQyxpQ0FBd0IsQ0FBQztTQUN0QyxDQUFDO09BQ1cscUJBQXFCLENBQUk7SUFBRCw0QkFBQztDQUFBLEFBQXRDLElBQXNDO0FBQXpCLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgUm91dGVzIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcblxyXG5pbXBvcnQgeyBTdG9yZUFwcENvbXBvbmVudCB9IGZyb20gXCIuL3N0b3JlLWFwcC5jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgU3RvcmVBcHBQcm9kdWN0c0NvbXBvbmVudCB9IGZyb20gJy4vcHJvZHVjdHMvcHJvZHVjdHMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU3RvcmVBcHBDb250YWN0VXNDb21wb25lbnQgfSBmcm9tICcuL2NvbnRhY3QtdXMvY29udGFjdC11cy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTdG9yZUFwcEFib3V0VXNDb21wb25lbnQgfSBmcm9tICcuL2Fib3V0LXVzL2Fib3V0LXVzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFN0b3JlQXBwQ2FydENvbXBvbmVudCB9IGZyb20gJy4vY2FydC9jYXJ0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFN0b3JlQXBwUGF5bWVudENvbXBvbmVudCB9IGZyb20gJy4vcGF5bWVudC9wYXltZW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFN0b3JlQXBwTWVzc2VuZ2VyQ29tcG9uZW50IH0gZnJvbSAnLi9tZXNzZW5nZXIvbWVzc2VuZ2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFN0b3JlQXBwUGF5bWVudFN1Y2Nlc3NDb21wb25lbnQgfSBmcm9tICcuL3BheW1lbnQtc3VjY2Vzcy9wYXltZW50LXN1Y2Nlc3MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU3RvcmVBcHBPcmRlckxpc3RDb21wb25lbnQgfSBmcm9tICcuL29yZGVyLWxpc3Qvb3JkZXItbGlzdC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTdG9yZUFwcE15QWNjb3VudENvbXBvbmVudCB9IGZyb20gJy4vbXktYWNjb3VudC9teS1hY2NvdW50LmNvbXBvbmVudCc7XHJcbmNvbnN0IHJvdXRlczogUm91dGVzID0gW1xyXG4gICAge1xyXG4gICAgICAgIHBhdGg6ICc6aWQnLFxyXG4gICAgICAgIGNvbXBvbmVudDogU3RvcmVBcHBDb21wb25lbnQsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgeyBwYXRoOiBcImFib3V0LXVzXCIsIGNvbXBvbmVudDogU3RvcmVBcHBBYm91dFVzQ29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogXCJwcm9kdWN0c1wiLCBjb21wb25lbnQ6IFN0b3JlQXBwUHJvZHVjdHNDb21wb25lbnQgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiBcImNvbnRhY3QtdXNcIiwgY29tcG9uZW50OiBTdG9yZUFwcENvbnRhY3RVc0NvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6IFwiY2FydFwiLCBjb21wb25lbnQ6IFN0b3JlQXBwQ2FydENvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6IFwicGF5bWVudFwiLCBjb21wb25lbnQ6IFN0b3JlQXBwUGF5bWVudENvbXBvbmVudCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6IFwibWVzc2VuZ2VyXCIsIGNvbXBvbmVudDogU3RvcmVBcHBNZXNzZW5nZXJDb21wb25lbnQgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiBcInBheW1lbnQtc3VjY2Vzcy86b3JkZXJcIiwgY29tcG9uZW50OiBTdG9yZUFwcFBheW1lbnRTdWNjZXNzQ29tcG9uZW50IH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogXCJvcmRlci1saXN0XCIsIGNvbXBvbmVudDogU3RvcmVBcHBPcmRlckxpc3RDb21wb25lbnQgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiBcIm15LWFjY291bnRcIiwgY29tcG9uZW50OiBTdG9yZUFwcE15QWNjb3VudENvbXBvbmVudCB9XHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG5cclxuXTtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvckNoaWxkKHJvdXRlcyldLFxyXG4gICAgZXhwb3J0czogW05hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIFN0b3JlQXBwUm91dGluZ01vZHVsZSB7IH1cclxuIl19