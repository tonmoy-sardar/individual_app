"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var application_settings_1 = require("application-settings");
var store_app_service_1 = require("../../../core/services/store-app.service");
var router_2 = require("@angular/router");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
var nativescript_paytm_1 = require("@nstudio/nativescript-paytm");
var Globals = require("../../../core/globals");
var StoreAppCartComponent = /** @class */ (function () {
    function StoreAppCartComponent(route, location, storeAppService, router) {
        this.route = route;
        this.location = location;
        this.storeAppService = storeAppService;
        this.router = router;
        this.orderToPaytm = {
            MID: "",
            ORDER_ID: "",
            CUST_ID: "",
            INDUSTRY_TYPE_ID: "",
            CHANNEL_ID: "",
            TXN_AMOUNT: "",
            WEBSITE: "",
            CALLBACK_URL: "",
            CHECKSUMHASH: ""
        };
        this.loader = new nativescript_loading_indicator_1.LoadingIndicator();
        this.lodaing_options = {
            message: 'Loading...',
            progress: 0.65,
            android: {
                indeterminate: true,
                cancelable: false,
                cancelListener: function (dialog) { console.log("Loading cancelled"); },
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
        };
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
        this.order = new store_app_service_1.OrderModule();
    }
    StoreAppCartComponent.prototype.ngOnInit = function () {
        this.currency = Globals.currency;
        var full_location = this.location.path().split('/');
        this.app_id = full_location[2].trim();
        this.user_id = application_settings_1.getString('user_id');
        this.populateData();
        this.paytm = new nativescript_paytm_1.Paytm();
    };
    StoreAppCartComponent.prototype.populateData = function () {
        var _this = this;
        this.secureStorage.get({
            key: "cart"
        }).then(function (value) {
            var data = JSON.parse(value);
            console.log(data);
            if (data != null) {
                _this.all_cart_data = data;
                var filteredData = data.filter(function (x) { return x.customer_id == _this.user_id && x.app_id == _this.app_id; });
                _this.customer_cart_data = filteredData;
                _this.getTotalItemPrice();
                _this.getTotalPackingPrice();
                _this.visible_key = true;
            }
            else {
                _this.customer_cart_data = [];
                _this.visible_key = true;
            }
        });
    };
    StoreAppCartComponent.prototype.getDiscount = function (price, discounted_price) {
        return Math.floor(((price - discounted_price) * 100) / price) + '%';
    };
    StoreAppCartComponent.prototype.increment = function (i) {
        var _this = this;
        var qty = this.customer_cart_data[i].quantity;
        this.customer_cart_data[i].quantity = qty + 1;
        var index = this.all_cart_data.findIndex(function (x) { return x.customer_id == _this.user_id && x.app_id == _this.app_id && x.product_id == _this.customer_cart_data[i].product_id; });
        if (index != -1) {
            this.all_cart_data[index].quantity = qty + 1;
            this.setCartData();
        }
    };
    StoreAppCartComponent.prototype.decrement = function (i) {
        var _this = this;
        var qty = this.customer_cart_data[i].quantity;
        if (qty > 1) {
            this.customer_cart_data[i].quantity = qty - 1;
            var index = this.all_cart_data.findIndex(function (x) { return x.customer_id == _this.user_id && x.app_id == _this.app_id && x.product_id == _this.customer_cart_data[i].product_id; });
            if (index != -1) {
                this.all_cart_data[index].quantity = qty - 1;
                this.setCartData();
            }
        }
        else {
            this.remove(this.customer_cart_data[i].product_id);
        }
    };
    StoreAppCartComponent.prototype.getTotalItemPrice = function () {
        var _this = this;
        this.total_item_price = 0;
        this.customer_cart_data.forEach(function (x) {
            if (x.discounted_price > 0) {
                _this.total_item_price += (x.discounted_price * x.quantity);
            }
            else {
                _this.total_item_price += (x.price * x.quantity);
            }
        });
    };
    StoreAppCartComponent.prototype.getTotalPackingPrice = function () {
        var _this = this;
        this.total_packing_price = 0;
        this.customer_cart_data.forEach(function (x) {
            _this.total_packing_price += x.packing_charges;
        });
    };
    StoreAppCartComponent.prototype.remove = function (id) {
        var _this = this;
        var index = this.all_cart_data.findIndex(function (x) { return x.customer_id == _this.user_id && x.app_id == _this.app_id && x.product_id == id; });
        console.log(index);
        if (index != -1) {
            this.all_cart_data.splice(index, 1);
            this.customer_cart_data.splice(index, 1);
            this.setCartData();
        }
    };
    StoreAppCartComponent.prototype.setCartData = function () {
        var _this = this;
        this.secureStorage.set({
            key: 'cart',
            value: JSON.stringify(this.all_cart_data)
        }).then(function (success) {
            console.log(success);
            _this.getTotalItemPrice();
            _this.getTotalPackingPrice();
        });
    };
    StoreAppCartComponent.prototype.shop = function () {
        this.router.navigate(['/store-app/' + this.app_id + '/products']);
    };
    StoreAppCartComponent.prototype.orderPlace = function () {
        // this.order.customer = this.user_id;
        // this.order.price = this.total_item_price + this.total_packing_price;
        // this.order.appmaster = this.app_id
        // var details_data = new OrderDetails();
        // var all_details_data = []
        // this.customer_cart_data.forEach(x => {
        //   details_data.appmaster = x.app_id;
        //   if (x.discounted_price > 0) {
        //     details_data.unit_price = x.discounted_price;
        //   }
        //   else {
        //     details_data.unit_price = x.price;
        //   }
        //   details_data.quantity = x.quantity;
        //   details_data.product = x.product_id;
        //   details_data.packaging_cost = x.packing_charges;
        //   details_data.uom = "0";
        //   details_data.IGST = "0";
        //   details_data.CGST = "0";
        //   all_details_data.push(details_data);
        //   var index = this.all_cart_data.findIndex(y => y.customer_id == this.user_id && y.app_id == this.app_id && y.product_id == x.product_id);
        //   if (index != -1) {
        //     this.all_cart_data.splice(index, 1);
        //   }
        // })
        // this.order.order_details = all_details_data;
        // this.setCartData();
        // this.storeAppService.createOrder(this.order).subscribe(
        //   res => {
        //     console.log(res)
        //     this.router.navigate(['/store-app/', this.app_id, 'payment'])
        //   },
        //   error => {
        //     console.log(error)
        //   }
        // )
        this.router.navigate(['/store-app/', this.app_id, 'payment']);
        // this.getPaytmFormValue(this.order.price)
    };
    StoreAppCartComponent = __decorate([
        core_1.Component({
            selector: "cart",
            moduleId: module.id,
            templateUrl: "./cart.component.html",
            styleUrls: ['./cart.component.css']
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            common_1.Location,
            store_app_service_1.StoreAppService,
            router_2.Router])
    ], StoreAppCartComponent);
    return StoreAppCartComponent;
}());
exports.StoreAppCartComponent = StoreAppCartComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEwQztBQUMxQywwQ0FBaUQ7QUFDakQsMENBQTJDO0FBQzNDLDJFQUE0RDtBQUM1RCw2REFBMkY7QUFDM0YsOEVBQXNHO0FBQ3RHLDBDQUF5QztBQUN6QyxpRkFBa0U7QUFDbEUsa0VBS3FDO0FBQ3JDLCtDQUFpRDtBQVFqRDtJQWlERSwrQkFDVSxLQUFxQixFQUNyQixRQUFrQixFQUNsQixlQUFnQyxFQUNoQyxNQUFjO1FBSGQsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQXhDeEIsaUJBQVksR0FBVTtZQUNwQixHQUFHLEVBQUUsRUFBRTtZQUNQLFFBQVEsRUFBRSxFQUFFO1lBQ1osT0FBTyxFQUFFLEVBQUU7WUFDWCxnQkFBZ0IsRUFBRSxFQUFFO1lBQ3BCLFVBQVUsRUFBRSxFQUFFO1lBQ2QsVUFBVSxFQUFFLEVBQUU7WUFDZCxPQUFPLEVBQUUsRUFBRTtZQUNYLFlBQVksRUFBRSxFQUFFO1lBQ2hCLFlBQVksRUFBRSxFQUFFO1NBQ2pCLENBQUM7UUFDRixXQUFNLEdBQUcsSUFBSSxpREFBZ0IsRUFBRSxDQUFDO1FBQ2hDLG9CQUFlLEdBQUc7WUFDaEIsT0FBTyxFQUFFLFlBQVk7WUFDckIsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUU7Z0JBQ1AsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixjQUFjLEVBQUUsVUFBVSxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBLENBQUMsQ0FBQztnQkFDdEUsR0FBRyxFQUFFLEdBQUc7Z0JBQ1Isb0JBQW9CLEVBQUUsU0FBUztn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b3JlJztcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgU2VjdXJlU3RvcmFnZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc2VjdXJlLXN0b3JhZ2VcIjtcclxuaW1wb3J0IHsgZ2V0U3RyaW5nLCBzZXRTdHJpbmcsIGdldEJvb2xlYW4sIHNldEJvb2xlYW4sIGNsZWFyIH0gZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCB7IFN0b3JlQXBwU2VydmljZSwgT3JkZXJNb2R1bGUsIE9yZGVyRGV0YWlscyB9IGZyb20gXCIuLi8uLi8uLi9jb3JlL3NlcnZpY2VzL3N0b3JlLWFwcC5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgTG9hZGluZ0luZGljYXRvciB9IGZyb20gXCJuYXRpdmVzY3JpcHQtbG9hZGluZy1pbmRpY2F0b3JcIjtcclxuaW1wb3J0IHtcclxuICBQYXl0bSxcclxuICBPcmRlcixcclxuICBUcmFuc2FjdGlvbkNhbGxiYWNrLFxyXG4gIElPU0NhbGxiYWNrXHJcbn0gZnJvbSBcIkBuc3R1ZGlvL25hdGl2ZXNjcmlwdC1wYXl0bVwiO1xyXG5pbXBvcnQgKiBhcyBHbG9iYWxzIGZyb20gJy4uLy4uLy4uL2NvcmUvZ2xvYmFscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJjYXJ0XCIsXHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICB0ZW1wbGF0ZVVybDogXCIuL2NhcnQuY29tcG9uZW50Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFsnLi9jYXJ0LmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU3RvcmVBcHBDYXJ0Q29tcG9uZW50IHtcclxuICBhcHBfaWQ6IHN0cmluZztcclxuICBzZWN1cmVTdG9yYWdlOiBTZWN1cmVTdG9yYWdlO1xyXG4gIGN1c3RvbWVyX2NhcnRfZGF0YTogYW55O1xyXG4gIHVzZXJfaWQ6IHN0cmluZztcclxuICB2aXNpYmxlX2tleTogYm9vbGVhbjtcclxuICB0b3RhbF9pdGVtX3ByaWNlOiBudW1iZXI7XHJcbiAgdG90YWxfcGFja2luZ19wcmljZTogbnVtYmVyO1xyXG4gIHRvdGFsX3ByaWNlOiBudW1iZXI7XHJcbiAgYWxsX2NhcnRfZGF0YTogYW55O1xyXG4gIG9yZGVyOiBPcmRlck1vZHVsZTtcclxuICBwYXl0bUZvcm1EZXRhaWxzOiBhbnk7XHJcbiAgcGF5dG06IFBheXRtO1xyXG4gIG9yZGVyVG9QYXl0bTogT3JkZXIgPSB7XHJcbiAgICBNSUQ6IFwiXCIsXHJcbiAgICBPUkRFUl9JRDogXCJcIixcclxuICAgIENVU1RfSUQ6IFwiXCIsXHJcbiAgICBJTkRVU1RSWV9UWVBFX0lEOiBcIlwiLFxyXG4gICAgQ0hBTk5FTF9JRDogXCJcIixcclxuICAgIFRYTl9BTU9VTlQ6IFwiXCIsXHJcbiAgICBXRUJTSVRFOiBcIlwiLFxyXG4gICAgQ0FMTEJBQ0tfVVJMOiBcIlwiLFxyXG4gICAgQ0hFQ0tTVU1IQVNIOiBcIlwiXHJcbiAgfTtcclxuICBsb2FkZXIgPSBuZXcgTG9hZGluZ0luZGljYXRvcigpO1xyXG4gIGxvZGFpbmdfb3B0aW9ucyA9IHtcclxuICAgIG1lc3NhZ2U6ICdMb2FkaW5nLi4uJyxcclxuICAgIHByb2dyZXNzOiAwLjY1LFxyXG4gICAgYW5kcm9pZDoge1xyXG4gICAgICBpbmRldGVybWluYXRlOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgY2FuY2VsTGlzdGVuZXI6IGZ1bmN0aW9uIChkaWFsb2cpIHsgY29uc29sZS5sb2coXCJMb2FkaW5nIGNhbmNlbGxlZFwiKSB9LFxyXG4gICAgICBtYXg6IDEwMCxcclxuICAgICAgcHJvZ3Jlc3NOdW1iZXJGb3JtYXQ6IFwiJTFkLyUyZFwiLFxyXG4gICAgICBwcm9ncmVzc1BlcmNlbnRGb3JtYXQ6IDAuNTMsXHJcbiAgICAgIHByb2dyZXNzU3R5bGU6IDEsXHJcbiAgICAgIHNlY29uZGFyeVByb2dyZXNzOiAxXHJcbiAgICB9LFxyXG4gICAgaW9zOiB7XHJcbiAgICAgIGRldGFpbHM6IFwiQWRkaXRpb25hbCBkZXRhaWwgbm90ZSFcIixcclxuICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgZGltQmFja2dyb3VuZDogdHJ1ZSxcclxuICAgICAgY29sb3I6IFwiIzRCOUVENlwiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwieWVsbG93XCIsXHJcbiAgICAgIHVzZXJJbnRlcmFjdGlvbkVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICBoaWRlQmV6ZWw6IHRydWUsXHJcbiAgICB9XHJcbiAgfVxyXG4gIGN1cnJlbmN5OiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcclxuICAgIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLFxyXG4gICAgcHJpdmF0ZSBzdG9yZUFwcFNlcnZpY2U6IFN0b3JlQXBwU2VydmljZSxcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcclxuICApIHtcclxuICAgIHRoaXMuc2VjdXJlU3RvcmFnZSA9IG5ldyBTZWN1cmVTdG9yYWdlKCk7XHJcbiAgICB0aGlzLm9yZGVyID0gbmV3IE9yZGVyTW9kdWxlKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuY3VycmVuY3kgPSBHbG9iYWxzLmN1cnJlbmN5XHJcbiAgICB2YXIgZnVsbF9sb2NhdGlvbiA9IHRoaXMubG9jYXRpb24ucGF0aCgpLnNwbGl0KCcvJyk7XHJcbiAgICB0aGlzLmFwcF9pZCA9IGZ1bGxfbG9jYXRpb25bMl0udHJpbSgpO1xyXG4gICAgdGhpcy51c2VyX2lkID0gZ2V0U3RyaW5nKCd1c2VyX2lkJyk7XHJcbiAgICB0aGlzLnBvcHVsYXRlRGF0YSgpO1xyXG4gICAgdGhpcy5wYXl0bSA9IG5ldyBQYXl0bSgpO1xyXG4gIH1cclxuXHJcbiAgcG9wdWxhdGVEYXRhKCkge1xyXG4gICAgdGhpcy5zZWN1cmVTdG9yYWdlLmdldCh7XHJcbiAgICAgIGtleTogXCJjYXJ0XCJcclxuICAgIH0pLnRoZW4oXHJcbiAgICAgIHZhbHVlID0+IHtcclxuICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UodmFsdWUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGlmIChkYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgIHRoaXMuYWxsX2NhcnRfZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICB2YXIgZmlsdGVyZWREYXRhID0gZGF0YS5maWx0ZXIoeCA9PiB4LmN1c3RvbWVyX2lkID09IHRoaXMudXNlcl9pZCAmJiB4LmFwcF9pZCA9PSB0aGlzLmFwcF9pZClcclxuICAgICAgICAgIHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhID0gZmlsdGVyZWREYXRhO1xyXG4gICAgICAgICAgdGhpcy5nZXRUb3RhbEl0ZW1QcmljZSgpO1xyXG4gICAgICAgICAgdGhpcy5nZXRUb3RhbFBhY2tpbmdQcmljZSgpO1xyXG4gICAgICAgICAgdGhpcy52aXNpYmxlX2tleSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGEgPSBbXTtcclxuICAgICAgICAgIHRoaXMudmlzaWJsZV9rZXkgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldERpc2NvdW50KHByaWNlLCBkaXNjb3VudGVkX3ByaWNlKSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcigoKHByaWNlIC0gZGlzY291bnRlZF9wcmljZSkgKiAxMDApIC8gcHJpY2UpICsgJyUnO1xyXG4gIH1cclxuXHJcbiAgaW5jcmVtZW50KGkpIHtcclxuICAgIHZhciBxdHkgPSB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YVtpXS5xdWFudGl0eTtcclxuICAgIHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhW2ldLnF1YW50aXR5ID0gcXR5ICsgMTtcclxuICAgIHZhciBpbmRleCA9IHRoaXMuYWxsX2NhcnRfZGF0YS5maW5kSW5kZXgoeCA9PiB4LmN1c3RvbWVyX2lkID09IHRoaXMudXNlcl9pZCAmJiB4LmFwcF9pZCA9PSB0aGlzLmFwcF9pZCAmJiB4LnByb2R1Y3RfaWQgPT0gdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGFbaV0ucHJvZHVjdF9pZCk7XHJcbiAgICBpZiAoaW5kZXggIT0gLTEpIHtcclxuICAgICAgdGhpcy5hbGxfY2FydF9kYXRhW2luZGV4XS5xdWFudGl0eSA9IHF0eSArIDE7XHJcbiAgICAgIHRoaXMuc2V0Q2FydERhdGEoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVjcmVtZW50KGkpIHtcclxuICAgIHZhciBxdHkgPSB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YVtpXS5xdWFudGl0eTtcclxuICAgIGlmIChxdHkgPiAxKSB7XHJcbiAgICAgIHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhW2ldLnF1YW50aXR5ID0gcXR5IC0gMTtcclxuICAgICAgdmFyIGluZGV4ID0gdGhpcy5hbGxfY2FydF9kYXRhLmZpbmRJbmRleCh4ID0+IHguY3VzdG9tZXJfaWQgPT0gdGhpcy51c2VyX2lkICYmIHguYXBwX2lkID09IHRoaXMuYXBwX2lkICYmIHgucHJvZHVjdF9pZCA9PSB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YVtpXS5wcm9kdWN0X2lkKTtcclxuICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XHJcbiAgICAgICAgdGhpcy5hbGxfY2FydF9kYXRhW2luZGV4XS5xdWFudGl0eSA9IHF0eSAtIDE7XHJcbiAgICAgICAgdGhpcy5zZXRDYXJ0RGF0YSgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnJlbW92ZSh0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YVtpXS5wcm9kdWN0X2lkKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0VG90YWxJdGVtUHJpY2UoKSB7XHJcbiAgICB0aGlzLnRvdGFsX2l0ZW1fcHJpY2UgPSAwO1xyXG4gICAgdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGEuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgaWYgKHguZGlzY291bnRlZF9wcmljZSA+IDApIHtcclxuICAgICAgICB0aGlzLnRvdGFsX2l0ZW1fcHJpY2UgKz0gKHguZGlzY291bnRlZF9wcmljZSAqIHgucXVhbnRpdHkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMudG90YWxfaXRlbV9wcmljZSArPSAoeC5wcmljZSAqIHgucXVhbnRpdHkpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZ2V0VG90YWxQYWNraW5nUHJpY2UoKSB7XHJcbiAgICB0aGlzLnRvdGFsX3BhY2tpbmdfcHJpY2UgPSAwO1xyXG4gICAgdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGEuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgdGhpcy50b3RhbF9wYWNraW5nX3ByaWNlICs9IHgucGFja2luZ19jaGFyZ2VzO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHJlbW92ZShpZCkge1xyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5hbGxfY2FydF9kYXRhLmZpbmRJbmRleCh4ID0+IHguY3VzdG9tZXJfaWQgPT0gdGhpcy51c2VyX2lkICYmIHguYXBwX2lkID09IHRoaXMuYXBwX2lkICYmIHgucHJvZHVjdF9pZCA9PSBpZCk7XHJcbiAgICBjb25zb2xlLmxvZyhpbmRleClcclxuICAgIGlmIChpbmRleCAhPSAtMSkge1xyXG4gICAgICB0aGlzLmFsbF9jYXJ0X2RhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgdGhpcy5zZXRDYXJ0RGF0YSgpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRDYXJ0RGF0YSgpIHtcclxuICAgIHRoaXMuc2VjdXJlU3RvcmFnZS5zZXQoe1xyXG4gICAgICBrZXk6ICdjYXJ0JyxcclxuICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHRoaXMuYWxsX2NhcnRfZGF0YSlcclxuICAgIH0pLnRoZW4oc3VjY2VzcyA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHN1Y2Nlc3MpXHJcbiAgICAgIHRoaXMuZ2V0VG90YWxJdGVtUHJpY2UoKTtcclxuICAgICAgdGhpcy5nZXRUb3RhbFBhY2tpbmdQcmljZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzaG9wKCkge1xyXG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvc3RvcmUtYXBwLycgKyB0aGlzLmFwcF9pZCArICcvcHJvZHVjdHMnXSlcclxuICB9XHJcblxyXG4gIG9yZGVyUGxhY2UoKSB7XHJcbiAgICAvLyB0aGlzLm9yZGVyLmN1c3RvbWVyID0gdGhpcy51c2VyX2lkO1xyXG4gICAgLy8gdGhpcy5vcmRlci5wcmljZSA9IHRoaXMudG90YWxfaXRlbV9wcmljZSArIHRoaXMudG90YWxfcGFja2luZ19wcmljZTtcclxuICAgIC8vIHRoaXMub3JkZXIuYXBwbWFzdGVyID0gdGhpcy5hcHBfaWRcclxuICAgIC8vIHZhciBkZXRhaWxzX2RhdGEgPSBuZXcgT3JkZXJEZXRhaWxzKCk7XHJcbiAgICAvLyB2YXIgYWxsX2RldGFpbHNfZGF0YSA9IFtdXHJcbiAgICAvLyB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YS5mb3JFYWNoKHggPT4ge1xyXG4gICAgLy8gICBkZXRhaWxzX2RhdGEuYXBwbWFzdGVyID0geC5hcHBfaWQ7XHJcbiAgICAvLyAgIGlmICh4LmRpc2NvdW50ZWRfcHJpY2UgPiAwKSB7XHJcbiAgICAvLyAgICAgZGV0YWlsc19kYXRhLnVuaXRfcHJpY2UgPSB4LmRpc2NvdW50ZWRfcHJpY2U7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vICAgZWxzZSB7XHJcbiAgICAvLyAgICAgZGV0YWlsc19kYXRhLnVuaXRfcHJpY2UgPSB4LnByaWNlO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIGRldGFpbHNfZGF0YS5xdWFudGl0eSA9IHgucXVhbnRpdHk7XHJcbiAgICAvLyAgIGRldGFpbHNfZGF0YS5wcm9kdWN0ID0geC5wcm9kdWN0X2lkO1xyXG4gICAgLy8gICBkZXRhaWxzX2RhdGEucGFja2FnaW5nX2Nvc3QgPSB4LnBhY2tpbmdfY2hhcmdlcztcclxuICAgIC8vICAgZGV0YWlsc19kYXRhLnVvbSA9IFwiMFwiO1xyXG4gICAgLy8gICBkZXRhaWxzX2RhdGEuSUdTVCA9IFwiMFwiO1xyXG4gICAgLy8gICBkZXRhaWxzX2RhdGEuQ0dTVCA9IFwiMFwiO1xyXG4gICAgLy8gICBhbGxfZGV0YWlsc19kYXRhLnB1c2goZGV0YWlsc19kYXRhKTtcclxuICAgIC8vICAgdmFyIGluZGV4ID0gdGhpcy5hbGxfY2FydF9kYXRhLmZpbmRJbmRleCh5ID0+IHkuY3VzdG9tZXJfaWQgPT0gdGhpcy51c2VyX2lkICYmIHkuYXBwX2lkID09IHRoaXMuYXBwX2lkICYmIHkucHJvZHVjdF9pZCA9PSB4LnByb2R1Y3RfaWQpO1xyXG4gICAgLy8gICBpZiAoaW5kZXggIT0gLTEpIHtcclxuICAgIC8vICAgICB0aGlzLmFsbF9jYXJ0X2RhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfSlcclxuICAgIC8vIHRoaXMub3JkZXIub3JkZXJfZGV0YWlscyA9IGFsbF9kZXRhaWxzX2RhdGE7XHJcbiAgICAvLyB0aGlzLnNldENhcnREYXRhKCk7XHJcbiAgICAvLyB0aGlzLnN0b3JlQXBwU2VydmljZS5jcmVhdGVPcmRlcih0aGlzLm9yZGVyKS5zdWJzY3JpYmUoXHJcbiAgICAvLyAgIHJlcyA9PiB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgLy8gICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL3N0b3JlLWFwcC8nLCB0aGlzLmFwcF9pZCwgJ3BheW1lbnQnXSlcclxuICAgIC8vICAgfSxcclxuICAgIC8vICAgZXJyb3IgPT4ge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyApXHJcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9zdG9yZS1hcHAvJywgdGhpcy5hcHBfaWQsICdwYXltZW50J10pXHJcbiAgICAvLyB0aGlzLmdldFBheXRtRm9ybVZhbHVlKHRoaXMub3JkZXIucHJpY2UpXHJcbiAgfVxyXG5cclxuICAvLyBnZXRQYXl0bUZvcm1WYWx1ZShhbW91bnQ6IG51bWJlcikge1xyXG4gIC8vICAgdGhpcy5zdG9yZUFwcFNlcnZpY2UucGF5dG1Gb3JtVmFsdWUoYW1vdW50KS5zdWJzY3JpYmUoXHJcbiAgLy8gICAgIHJlcyA9PiB7XHJcbiAgLy8gICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gIC8vICAgICAgIHRoaXMucGF5dG1Gb3JtRGV0YWlscyA9IHJlcztcclxuICAvLyAgICAgICB0aGlzLnBheVZpYVBheXRtKCk7XHJcbiAgLy8gICAgIH0sXHJcbiAgLy8gICAgIGVycm9yID0+IHtcclxuICAvLyAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAvLyAgICAgfVxyXG4gIC8vICAgKVxyXG4gIC8vIH1cclxuXHJcbiAgLy8gLy8gcGF5dG1cclxuICAvLyBwYXlWaWFQYXl0bSgpIHtcclxuICAvLyAgIHRoaXMucGF5dG0uc2V0SU9TQ2FsbGJhY2tzKHtcclxuICAvLyAgICAgZGlkRmluaXNoZWRSZXNwb25zZTogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgLy8gICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gIC8vICAgICB9LFxyXG4gIC8vICAgICBkaWRDYW5jZWxUcmFuc2FjdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gIC8vICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBjYW5jZWxsZWQgdHJhbnNhY3Rpb25cIik7XHJcbiAgLy8gICAgIH0sXHJcbiAgLy8gICAgIGVycm9yTWlzc2luZ1BhcmFtZXRlckVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAvLyAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgLy8gICAgIH1cclxuICAvLyAgIH0pO1xyXG4gIC8vICAgdGhpcy5vcmRlclRvUGF5dG0gPSB7XHJcbiAgLy8gICAgIE1JRDogdGhpcy5wYXl0bUZvcm1EZXRhaWxzWydNSUQnXSxcclxuICAvLyAgICAgT1JERVJfSUQ6IHRoaXMucGF5dG1Gb3JtRGV0YWlsc1snT1JERVJfSUQnXSxcclxuICAvLyAgICAgQ1VTVF9JRDogdGhpcy5wYXl0bUZvcm1EZXRhaWxzWydDVVNUX0lEJ10sXHJcbiAgLy8gICAgIElORFVTVFJZX1RZUEVfSUQ6IHRoaXMucGF5dG1Gb3JtRGV0YWlsc1snSU5EVVNUUllfVFlQRV9JRCddLFxyXG4gIC8vICAgICBDSEFOTkVMX0lEOiB0aGlzLnBheXRtRm9ybURldGFpbHNbJ0NIQU5ORUxfSUQnXSxcclxuICAvLyAgICAgVFhOX0FNT1VOVDogdGhpcy5wYXl0bUZvcm1EZXRhaWxzWydUWE5fQU1PVU5UJ10sXHJcbiAgLy8gICAgIFdFQlNJVEU6IHRoaXMucGF5dG1Gb3JtRGV0YWlsc1snV0VCU0lURSddLFxyXG4gIC8vICAgICBDQUxMQkFDS19VUkw6IHRoaXMucGF5dG1Gb3JtRGV0YWlsc1snQ0FMTEJBQ0tfVVJMJ10sXHJcbiAgLy8gICAgIENIRUNLU1VNSEFTSDogdGhpcy5wYXl0bUZvcm1EZXRhaWxzWydDSEVDS1NVTUhBU0gnXVxyXG4gIC8vICAgfTtcclxuICAvLyAgIHRoaXMucGF5dG0uY3JlYXRlT3JkZXIodGhpcy5vcmRlclRvUGF5dG0pO1xyXG4gIC8vICAgdGhpcy5wYXl0bS5pbml0aWFsaXplKFwiU1RBR0lOR1wiKTtcclxuICAvLyAgIHRoaXMucGF5dG0uc3RhcnRQYXltZW50VHJhbnNhY3Rpb24oe1xyXG4gIC8vICAgICBzb21lVUlFcnJvck9jY3VycmVkOiBmdW5jdGlvbiAoaW5FcnJvck1lc3NhZ2UpIHtcclxuICAvLyAgICAgICBjb25zb2xlLmxvZyhpbkVycm9yTWVzc2FnZSk7XHJcbiAgLy8gICAgIH0sXHJcbiAgLy8gICAgIG9uVHJhbnNhY3Rpb25SZXNwb25zZTogZnVuY3Rpb24gKGluUmVzcG9uc2UpIHtcclxuICAvLyAgICAgICBjb25zb2xlLmxvZyhpblJlc3BvbnNlKTtcclxuICAvLyAgICAgfSxcclxuICAvLyAgICAgbmV0d29ya05vdEF2YWlsYWJsZTogZnVuY3Rpb24gKCkge1xyXG4gIC8vICAgICAgIGNvbnNvbGUubG9nKFwiTmV0d29yayBub3QgYXZhaWxhYmxlXCIpO1xyXG4gIC8vICAgICB9LFxyXG4gIC8vICAgICBjbGllbnRBdXRoZW50aWNhdGlvbkZhaWxlZDogZnVuY3Rpb24gKGluRXJyb3JNZXNzYWdlKSB7XHJcbiAgLy8gICAgICAgY29uc29sZS5sb2coaW5FcnJvck1lc3NhZ2UpO1xyXG4gIC8vICAgICB9LFxyXG4gIC8vICAgICBvbkVycm9yTG9hZGluZ1dlYlBhZ2U6IGZ1bmN0aW9uIChcclxuICAvLyAgICAgICBpbmlFcnJvckNvZGUsXHJcbiAgLy8gICAgICAgaW5FcnJvck1lc3NhZ2UsXHJcbiAgLy8gICAgICAgaW5GYWlsaW5nVXJsXHJcbiAgLy8gICAgICkge1xyXG4gIC8vICAgICAgIGNvbnNvbGUubG9nKGluaUVycm9yQ29kZSwgaW5FcnJvck1lc3NhZ2UsIGluRmFpbGluZ1VybCk7XHJcbiAgLy8gICAgIH0sXHJcbiAgLy8gICAgIG9uQmFja1ByZXNzZWRDYW5jZWxUcmFuc2FjdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gIC8vICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBjYW5jZWxsZWQgdHJhbnNhY3Rpb24gYnkgcHJlc3NpbmcgYmFjayBidXR0b25cIik7XHJcbiAgLy8gICAgIH0sXHJcbiAgLy8gICAgIG9uVHJhbnNhY3Rpb25DYW5jZWw6IGZ1bmN0aW9uIChpbkVycm9yTWVzc2FnZSwgaW5SZXNwb25zZSkge1xyXG4gIC8vICAgICAgIGNvbnNvbGUubG9nKGluRXJyb3JNZXNzYWdlLCBpblJlc3BvbnNlKTtcclxuICAvLyAgICAgfVxyXG4gIC8vICAgfSk7XHJcbiAgLy8gfVxyXG59Il19