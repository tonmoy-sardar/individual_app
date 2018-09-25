import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { StoreAppService } from "../../../core/services/store-app.service";
import { Location } from '@angular/common';
import { SecureStorage } from "nativescript-secure-storage";
import { getString, setString, getBoolean, setBoolean, clear } from "application-settings";
import { Observable } from "tns-core-modules/data/observable";
import { LoadingIndicator } from "nativescript-loading-indicator";
import * as Globals from '../../../core/globals';
@Component({
    selector: 'products',
    moduleId: module.id,
    templateUrl: `products.component.html`,
    styleUrls: [`products.component.css`]
})

export class StoreAppProductsComponent implements OnInit {
    app_id: string;
    app_details: any;
    img_base_url: string;
    category_list: any = [];
    accordian_view_key: boolean;
    list_view_key: boolean;
    customer_cart_data: any;
    secureStorage: SecureStorage;
    user_id: string;
    loader = new LoadingIndicator();
    serviceType;
    lodaing_options = {
        message: 'Loading...',
        progress: 0.65,
        android: {
            indeterminate: true,
            cancelable: false,
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
    currency: string;
    constructor(
        private route: ActivatedRoute,
        private storeAppService: StoreAppService,
        private location: Location,
    ) {
        this.secureStorage = new SecureStorage();
    }

    ngOnInit() {

        this.storeAppService.pageStatus(false);
        this.img_base_url = Globals.img_base_url;
        var full_location = this.location.path().split('/');
        this.app_id = full_location[2].trim();
        this.user_id = getString('user_id');
        this.currency = Globals.currency
        // this.secureStorage.remove({
        //     key: "cart"
        // }).then(success => console.log("Successfully removed a value? " + success));

        this.secureStorage.get({
            key: "cart"
        }).then(
            value => {
                var data = JSON.parse(value);
                // console.log(data);
                if (data != null) {
                    this.customer_cart_data = data;
                }
                else {
                    this.customer_cart_data = [];
                }

                this.getStoreAppProductDetails(this.app_id);
            }
        );
    }

    getStoreAppProductDetails(id) {
        this.loader.show(this.lodaing_options);
        this.storeAppService.getStoreAppProductDetails(id).subscribe(
            res => {
                this.app_details = res;
                this.category_list = this.app_details.app_product_categories;


                if (this.app_details.is_product_service) {
                    this.serviceType = this.app_details.is_product_service;
                }
                else {
                    this.serviceType = 1
                }

                for (var i = 0; i < this.category_list.length; i++) {
                    this.category_list[i]['items'] = JSON.parse(JSON.stringify(this.category_list[i].products));
                    // isCart implemented
                    for (var j = 0; j < this.category_list[i].items.length; j++) {
                        var index = this.customer_cart_data.findIndex(y => y.app_id == this.category_list[i].items[j].app_master && y.product_id == this.category_list[i].items[j].id && y.customer_id == this.user_id);

                        if (index != -1) {
                            this.category_list[i].items[j]['isCart'] = true;
                            this.category_list[i].items[j]['quantity'] = this.customer_cart_data[index].quantity
                        }
                        else {
                            this.category_list[i].items[j]['isCart'] = false;
                            this.category_list[i].items[j]['quantity'] = 0;
                        }
                    }
                }

                if (this.category_list.length > 1) {
                    this.accordian_view_key = true
                }
                else if (this.category_list.length == 1) {
                    this.list_view_key = true;
                }

                this.loader.hide();
            },
            error => {

                this.loader.hide();
            }
        )
    }

    addToCart(item) {
        var data = {
            customer_id: this.user_id,
            app_id: this.app_id,
            product_id: item.id,
            product_name: item.product_name,
            description: item.description,
            product_code: item.product_code,
            price: item.price,
            discounted_price: item.discounted_price,
            tags: item.tags,
            packing_charges: item.packing_charges,
            hide_org_price_status: item.hide_org_price_status,
            quantity: item.quantity + 1
        }
        var index = this.customer_cart_data.findIndex(y => y.app_id == this.app_id && y.product_id == item.id && y.customer_id == this.user_id);
        for (var i = 0; i < this.category_list.length; i++) {
            var cat_index = this.category_list[i].items.findIndex(y => y.id == item.id && y.app_master == this.app_id);
            if (cat_index != -1) {
                this.category_list[i].items[cat_index].isCart = true;
                this.category_list[i].items[cat_index].quantity = item.quantity + 1

            }
        }

        if (index == -1) {
            this.customer_cart_data.push(data);
            this.setCartData();
        }

    }

    setCartData() {
        this.secureStorage.set({
            key: 'cart',
            value: JSON.stringify(this.customer_cart_data)
        }).then(success => {

            this.storeAppService.cartStatus(true);
        });
    }

    decrement(item) {
        if (item.quantity > 1) {
            var index = this.customer_cart_data.findIndex(y => y.app_id == this.app_id && y.product_id == item.id && y.customer_id == this.user_id);
            if (index != -1) {
                this.customer_cart_data[index].quantity = item.quantity - 1;
                this.setCartData();
            }
            for (var i = 0; i < this.category_list.length; i++) {
                var cat_index = this.category_list[i].items.findIndex(y => y.id == item.id && y.app_master == this.app_id);
                if (cat_index != -1) {
                    this.category_list[i].items[cat_index].quantity = item.quantity - 1
                }
            }

        }
        else {
            var index = this.customer_cart_data.findIndex(y => y.app_id == this.app_id && y.product_id == item.id && y.customer_id == this.user_id);
            if (index != -1) {
                this.customer_cart_data.splice(index, 1);
                this.setCartData();
            }
            for (var i = 0; i < this.category_list.length; i++) {
                var cat_index = this.category_list[i].items.findIndex(y => y.id == item.id && y.app_master == this.app_id);
                if (cat_index != -1) {

                    this.category_list[i].items[cat_index].isCart = false;
                    this.category_list[i].items[cat_index].quantity = item.quantity - 1
                }
            }



        }

    }
    increment(item) {
        var index = this.customer_cart_data.findIndex(y => y.app_id == this.app_id && y.product_id == item.id && y.customer_id == this.user_id);
        if (index != -1) {
            this.customer_cart_data[index].quantity = item.quantity + 1;
            this.setCartData();
        }
        for (var i = 0; i < this.category_list.length; i++) {
            var cat_index = this.category_list[i].items.findIndex(y => y.id == item.id && y.app_master == this.app_id);
            if (cat_index != -1) {
                this.category_list[i].items[cat_index].quantity = item.quantity + 1
            }
        }

    }

    getDiscount(price, discounted_price) {
        return Math.floor(((price - discounted_price) * 100) / price) + '%';
    }
}