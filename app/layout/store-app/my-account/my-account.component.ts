import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { getString, setString, getBoolean, setBoolean, clear } from "application-settings";
import { StoreAppService } from "../../../core/services/store-app.service";
import { LoadingIndicator } from "nativescript-loading-indicator";
@Component({
    selector: '',
    moduleId: module.id,
    templateUrl: `my-account.component.html`,
    styleUrls: [`my-account.component.css`]
})
export class StoreAppMyAccountComponent implements OnInit {
    app_details: any;
    app_id: string;
    user_id: string;
    customer_details: any;
    loader = new LoadingIndicator();
    serviceType;
    lodaing_options = {
        message: 'Loading...',
        progress: 0.65,
        android: {
            indeterminate: true,
            cancelable: true,
            cancelListener: function (dialog) { console.log("Loading cancelled") },
            max: 100,
            progressNumberFormat: "%1d/%2d",
            progressPercentFormat: 0.53,
            progressStyle: 1,
            secondaryProgress: 1
        },
        ios: {
            details: "Additional detail note!",
            margin: 10,
            dimBackground: true,
            color: "#4B9ED6",
            backgroundColor: "yellow",
            userInteractionEnabled: false,
            hideBezel: true,
        }
    }
    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private storeAppService: StoreAppService
    ) {

    }

    ngOnInit() {
        this.storeAppService.pageStatus(false);
        var full_location = this.location.path().split('/');
        this.app_id = full_location[2].trim();
        this.user_id = getString('user_id');
        this.getCustomerDetails(this.user_id)
        this.getAppDetails(this.app_id);
    }

    getCustomerDetails(id) {
        this.loader.show(this.lodaing_options);
        this.storeAppService.getCustomerDetails(id).subscribe(
            res => {
                // console.log(res)
                this.customer_details = res;
                this.loader.hide();
            },
            error => {
                this.loader.hide();
                // console.log(error)
            }
        )
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

            },
            error => {
                // console.log(error)
            }
        )
    }
}