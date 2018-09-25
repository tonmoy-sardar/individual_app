import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { SecureStorage } from "nativescript-secure-storage";
import { getString, setString, getBoolean, setBoolean, clear } from "application-settings";
import { StoreAppService, OrderModule, OrderDetails } from "../../../core/services/store-app.service";
import { Router } from "@angular/router";
import { LoadingIndicator } from "nativescript-loading-indicator";
import * as Globals from '../../../core/globals';

@Component({
  selector: "cart",
  moduleId: module.id,
  templateUrl: "./cart.component.html",
  styleUrls: ['./cart.component.css']
})
export class StoreAppCartComponent {
  app_id: string;
  secureStorage: SecureStorage;
  customer_cart_data: any;
  user_id: string;
  visible_key: boolean;
  total_item_price: number;
  total_packing_price: number;
  total_price: number;
  all_cart_data: any;
  order: OrderModule;
  
  loader = new LoadingIndicator();
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
    private location: Location,
    private storeAppService: StoreAppService,
    private router: Router
  ) {
    this.secureStorage = new SecureStorage();
    this.order = new OrderModule();
  }

  ngOnInit() {
    this.storeAppService.pageStatus(false);
    this.currency = Globals.currency
    var full_location = this.location.path().split('/');
    this.app_id = full_location[2].trim();
    this.user_id = getString('user_id');
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
          var filteredData = data.filter(x => x.customer_id == this.user_id && x.app_id == this.app_id)
          this.customer_cart_data = filteredData;
          this.getTotalItemPrice();
          this.getTotalPackingPrice();
          this.visible_key = true;
        }
        else {
          this.customer_cart_data = [];
          this.visible_key = true;
        }
      }
    );
  }

  getDiscount(price, discounted_price) {
    return Math.floor(((price - discounted_price) * 100) / price) + '%';
  }

  increment(i) {
    var qty = this.customer_cart_data[i].quantity;
    this.customer_cart_data[i].quantity = qty + 1;
    var index = this.all_cart_data.findIndex(x => x.customer_id == this.user_id && x.app_id == this.app_id && x.product_id == this.customer_cart_data[i].product_id);
    if (index != -1) {
      this.all_cart_data[index].quantity = qty + 1;
      this.setCartData()
    }
  }

  decrement(i) {
    var qty = this.customer_cart_data[i].quantity;
    if (qty > 1) {
      this.customer_cart_data[i].quantity = qty - 1;
      var index = this.all_cart_data.findIndex(x => x.customer_id == this.user_id && x.app_id == this.app_id && x.product_id == this.customer_cart_data[i].product_id);
      if (index != -1) {
        this.all_cart_data[index].quantity = qty - 1;
        this.setCartData()
      }
    }
    else {
      this.remove(this.customer_cart_data[i].product_id)
    }
  }

  getTotalItemPrice() {
    this.total_item_price = 0;
    this.customer_cart_data.forEach(x => {
      if (x.discounted_price > 0) {
        this.total_item_price += (x.discounted_price * x.quantity);
      }
      else {
        this.total_item_price += (x.price * x.quantity);
      }
    })
  }

  getTotalPackingPrice() {
    this.total_packing_price = 0;
    this.customer_cart_data.forEach(x => {
      this.total_packing_price += x.packing_charges;
    })
  }

  remove(id) {
    var index = this.all_cart_data.findIndex(x => x.customer_id == this.user_id && x.app_id == this.app_id && x.product_id == id);
    // console.log(index)
    if (index != -1) {
      this.all_cart_data.splice(index, 1);
      this.customer_cart_data.splice(index, 1);
      this.setCartData()
    }
  }

  setCartData() {
    this.secureStorage.set({
      key: 'cart',
      value: JSON.stringify(this.all_cart_data)
    }).then(success => {
      // console.log(success)
      this.getTotalItemPrice();
      this.getTotalPackingPrice();
      this.storeAppService.cartStatus(true);
    });
  }

  shop() {
    this.router.navigate(['/store-app/' + this.app_id + '/products'])
  }

  orderPlace() {
    this.router.navigate(['/store-app/', this.app_id, 'payment'])
  }

  
}