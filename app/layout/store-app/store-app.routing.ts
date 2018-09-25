import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { StoreAppComponent } from "./store-app.component";
import { StoreAppProductsComponent } from './products/products.component';
import { StoreAppContactUsComponent } from './contact-us/contact-us.component';
import { StoreAppAboutUsComponent } from './about-us/about-us.component';
import { StoreAppCartComponent } from './cart/cart.component';
import { StoreAppPaymentComponent } from './payment/payment.component';
import { StoreAppMessengerComponent } from './messenger/messenger.component';
import { StoreAppPaymentSuccessComponent } from './payment-success/payment-success.component';
import { StoreAppOrderListComponent } from './order-list/order-list.component';
import { StoreAppMyAccountComponent } from './my-account/my-account.component';
const routes: Routes = [
    {
        path: ':id',
        component: StoreAppComponent,
        children: [
            { path: "about-us", component: StoreAppAboutUsComponent },
            { path: "products", component: StoreAppProductsComponent },
            { path: "contact-us", component: StoreAppContactUsComponent },
            { path: "cart", component: StoreAppCartComponent },
            { path: "payment", component: StoreAppPaymentComponent },
            { path: "messenger", component: StoreAppMessengerComponent },
            { path: "payment-success/:order", component: StoreAppPaymentSuccessComponent },
            { path: "order-list", component: StoreAppOrderListComponent },
            { path: "my-account", component: StoreAppMyAccountComponent }
        ]
    }

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class StoreAppRoutingModule { }
