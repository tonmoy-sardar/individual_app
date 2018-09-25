import { Component, OnInit, Input } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { getString, setString, getBoolean, setBoolean, clear } from "application-settings";
import { StoreAppService } from "../../services/store-app.service";
import { SecureStorage } from "nativescript-secure-storage";

@Component({
    selector: "app-action-bar",
    moduleId: module.id,
    templateUrl: "./app-action-bar.component.html",
    styleUrls: ['./app-action-bar.component.css']
})
export class AppActionBarComponent implements OnInit {
    app_details: any;
    product_list: any = [];
    secureStorage: SecureStorage;
    @Input('appId') appId: string;
    visible_key: boolean;
    isLoggedin: boolean;
    all_cart_data: any;
    user_id: string;
    customer_cart_data: any = [];
    serviceType;
    cartStatus: boolean;
    pageStatus:boolean;
    isAboutPage:boolean;
    constructor(
        private _routerExtensions: RouterExtensions,
        private storeAppService: StoreAppService,
        private routerExtensions: RouterExtensions
    ) {
        this.secureStorage = new SecureStorage();
        storeAppService.getCartStatus.subscribe(status => this.changeCartStatus(status));
        storeAppService.getPageStatus.subscribe(status => this.changePageStatus(status));
    }

    private changeCartStatus(status: boolean): void {
        this.cartStatus = status;
        if (this.cartStatus == true) {
            this.populateData();
        }
    }

    private changePageStatus(status: boolean): void {
        this.pageStatus = status;
        if (this.pageStatus == true) {
            this.isAboutPage = true; 
        }
        else{
            this.isAboutPage = false;
        }

        //alert(this.userName)
    }

    ngOnInit() {
        if (getBoolean('isLoggedin')) {
            this.isLoggedin = getBoolean('isLoggedin');
        }
        this.user_id = getString('user_id');
        this.getAppDetails(this.appId);
        this.populateData();
    }

    populateData() {
        this.secureStorage.get({
            key: "cart"
        }).then(
            value => {
                var data = JSON.parse(value);
                // console.log(data);
                if (data != null) {
                    this.all_cart_data = data;
                    var filteredData = data.filter(x => x.customer_id == this.user_id && x.app_id == this.appId)
                    this.customer_cart_data = filteredData;
                }
                else {
                    this.customer_cart_data = [];
                }
            }
        );
    }

    getAppDetails(id) {
        this.storeAppService.getStoreAppDetails(id).subscribe(
            res => {
                this.app_details = res;
                if (this.app_details.is_product_service) {
                    this.serviceType = this.app_details.is_product_service;
                }
                else {
                    this.serviceType = 1
                }
                this.app_details.app_product_categories.forEach(x => {
                    x.products.forEach(y => {
                        this.product_list.push(y)
                    })
                })
                // console.log(res)
                this.visible_key = true;
            },
            error => {
                this.visible_key = true;
                // console.log(error)
            }
        )
    }
    goBack() {
        this.routerExtensions.back();
    }

    logout() {
        clear();
        this._routerExtensions.navigate(["/login"], { clearHistory: true });
    }

}