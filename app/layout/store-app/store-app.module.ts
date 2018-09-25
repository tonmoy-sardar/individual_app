import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { StoreAppRoutingModule } from './store-app.routing';
import { StoreAppComponent } from './store-app.component';
import { StoreAppProductsComponent } from './products/products.component';
import { StoreAppContactUsComponent } from './contact-us/contact-us.component';
import { StoreAppAboutUsComponent } from './about-us/about-us.component';
import { StoreAppCartComponent } from './cart/cart.component';
import { StoreAppPaymentComponent } from './payment/payment.component';
import { StoreAppMessengerComponent } from './messenger/messenger.component';
import { StoreAppPaymentSuccessComponent } from './payment-success/payment-success.component';
import { StoreAppOrderListComponent } from './order-list/order-list.component';
import { StoreAppMyAccountComponent } from './my-account/my-account.component';

import { CoreModule } from "../../core/core.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        StoreAppRoutingModule,
        CoreModule
    ],
    declarations: [
        StoreAppComponent,
        StoreAppAboutUsComponent,
        StoreAppProductsComponent,
        StoreAppContactUsComponent,
        StoreAppCartComponent,
        StoreAppPaymentComponent,
        StoreAppMessengerComponent,
        StoreAppPaymentSuccessComponent,
        StoreAppOrderListComponent,
        StoreAppMyAccountComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class StoreAppModule { }
