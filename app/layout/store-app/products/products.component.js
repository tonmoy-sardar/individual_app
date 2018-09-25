"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var store_app_service_1 = require("../../../core/services/store-app.service");
var common_1 = require("@angular/common");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var application_settings_1 = require("application-settings");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
var Globals = require("../../../core/globals");
var StoreAppProductsComponent = /** @class */ (function () {
    function StoreAppProductsComponent(route, storeAppService, location) {
        this.route = route;
        this.storeAppService = storeAppService;
        this.location = location;
        this.category_list = [];
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
    }
    StoreAppProductsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.img_base_url = Globals.img_base_url;
        var full_location = this.location.path().split('/');
        this.app_id = full_location[2].trim();
        this.user_id = application_settings_1.getString('user_id');
        this.currency = Globals.currency;
        // this.secureStorage.remove({
        //     key: "cart"
        // }).then(success => console.log("Successfully removed a value? " + success));
        this.secureStorage.get({
            key: "cart"
        }).then(function (value) {
            var data = JSON.parse(value);
            console.log(data);
            if (data != null) {
                _this.customer_cart_data = data;
            }
            else {
                _this.customer_cart_data = [];
            }
            _this.getAppDetails(_this.app_id);
        });
    };
    StoreAppProductsComponent.prototype.getAppDetails = function (id) {
        var _this = this;
        this.loader.show(this.lodaing_options);
        this.storeAppService.getStoreAppDetails(id).subscribe(function (res) {
            _this.app_details = res;
            _this.category_list = _this.app_details.app_product_categories;
            if (_this.app_details.is_product_service) {
                _this.serviceType = _this.app_details.is_product_service;
            }
            else {
                _this.serviceType = 1;
            }
            // console.log(this.customer_cart_data);
            for (var i = 0; i < _this.category_list.length; i++) {
                _this.category_list[i]['items'] = JSON.parse(JSON.stringify(_this.category_list[i].products));
                // isCart implemented
                for (var j = 0; j < _this.category_list[i].items.length; j++) {
                    var index = _this.customer_cart_data.findIndex(function (y) { return y.app_id == _this.category_list[i].items[j].app_master && y.product_id == _this.category_list[i].items[j].id && y.customer_id == _this.user_id; });
                    // console.log(index)
                    if (index != -1) {
                        _this.category_list[i].items[j]['isCart'] = true;
                        _this.category_list[i].items[j]['quantity'] = _this.customer_cart_data[index].quantity;
                    }
                    else {
                        _this.category_list[i].items[j]['isCart'] = false;
                        _this.category_list[i].items[j]['quantity'] = 0;
                    }
                }
            }
            console.log(_this.category_list);
            if (_this.category_list.length > 1) {
                _this.accordian_view_key = true;
            }
            else if (_this.category_list.length == 1) {
                _this.list_view_key = true;
            }
            console.log(res);
            _this.loader.hide();
        }, function (error) {
            console.log(error);
            _this.loader.hide();
        });
    };
    StoreAppProductsComponent.prototype.addToCart = function (item) {
        var _this = this;
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
        };
        var index = this.customer_cart_data.findIndex(function (y) { return y.app_id == _this.app_id && y.product_id == item.id && y.customer_id == _this.user_id; });
        for (var i = 0; i < this.category_list.length; i++) {
            var cat_index = this.category_list[i].items.findIndex(function (y) { return y.id == item.id && y.app_master == _this.app_id; });
            if (cat_index != -1) {
                this.category_list[i].items[cat_index].isCart = true;
                this.category_list[i].items[cat_index].quantity = item.quantity + 1;
                console.log(this.category_list);
            }
        }
        if (index == -1) {
            this.customer_cart_data.push(data);
            this.setCartData();
        }
    };
    StoreAppProductsComponent.prototype.setCartData = function () {
        this.secureStorage.set({
            key: 'cart',
            value: JSON.stringify(this.customer_cart_data)
        }).then(function (success) {
            console.log(success);
        });
    };
    StoreAppProductsComponent.prototype.decrement = function (item) {
        var _this = this;
        if (item.quantity > 1) {
            var index = this.customer_cart_data.findIndex(function (y) { return y.app_id == _this.app_id && y.product_id == item.id && y.customer_id == _this.user_id; });
            if (index != -1) {
                this.customer_cart_data[index].quantity = item.quantity - 1;
                this.setCartData();
            }
            for (var i = 0; i < this.category_list.length; i++) {
                var cat_index = this.category_list[i].items.findIndex(function (y) { return y.id == item.id && y.app_master == _this.app_id; });
                if (cat_index != -1) {
                    this.category_list[i].items[cat_index].quantity = item.quantity - 1;
                }
            }
        }
        else {
            var index = this.customer_cart_data.findIndex(function (y) { return y.app_id == _this.app_id && y.product_id == item.id && y.customer_id == _this.user_id; });
            if (index != -1) {
                this.customer_cart_data.splice(index, 1);
                this.setCartData();
            }
            for (var i = 0; i < this.category_list.length; i++) {
                var cat_index = this.category_list[i].items.findIndex(function (y) { return y.id == item.id && y.app_master == _this.app_id; });
                if (cat_index != -1) {
                    console.log("cat_index" + cat_index);
                    this.category_list[i].items[cat_index].isCart = false;
                    this.category_list[i].items[cat_index].quantity = item.quantity - 1;
                }
            }
            console.log(this.category_list);
        }
    };
    StoreAppProductsComponent.prototype.increment = function (item) {
        var _this = this;
        var index = this.customer_cart_data.findIndex(function (y) { return y.app_id == _this.app_id && y.product_id == item.id && y.customer_id == _this.user_id; });
        if (index != -1) {
            this.customer_cart_data[index].quantity = item.quantity + 1;
            this.setCartData();
        }
        for (var i = 0; i < this.category_list.length; i++) {
            var cat_index = this.category_list[i].items.findIndex(function (y) { return y.id == item.id && y.app_master == _this.app_id; });
            if (cat_index != -1) {
                this.category_list[i].items[cat_index].quantity = item.quantity + 1;
            }
        }
    };
    StoreAppProductsComponent.prototype.getDiscount = function (price, discounted_price) {
        return Math.floor(((price - discounted_price) * 100) / price) + '%';
    };
    StoreAppProductsComponent = __decorate([
        core_1.Component({
            selector: 'products',
            moduleId: module.id,
            templateUrl: "products.component.html",
            styleUrls: ["products.component.css"]
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            store_app_service_1.StoreAppService,
            common_1.Location])
    ], StoreAppProductsComponent);
    return StoreAppProductsComponent;
}());
exports.StoreAppProductsComponent = StoreAppProductsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdHMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvZHVjdHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQUNqRCw4RUFBMkU7QUFDM0UsMENBQTJDO0FBQzNDLDJFQUE0RDtBQUM1RCw2REFBMkY7QUFFM0YsaUZBQWtFO0FBQ2xFLCtDQUFpRDtBQVFqRDtJQW9DSSxtQ0FDWSxLQUFxQixFQUNyQixlQUFnQyxFQUNoQyxRQUFrQjtRQUZsQixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQW5DOUIsa0JBQWEsR0FBUSxFQUFFLENBQUM7UUFNeEIsV0FBTSxHQUFHLElBQUksaURBQWdCLEVBQUUsQ0FBQztRQUVoQyxvQkFBZSxHQUFHO1lBQ2QsT0FBTyxFQUFFLFlBQVk7WUFDckIsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUU7Z0JBQ0wsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixjQUFjLEVBQUUsVUFBVSxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBLENBQUMsQ0FBQztnQkFDdEUsR0FBRyxFQUFFLEdBQUc7Z0JBQ1Isb0JBQW9CLEVBQUUsU0FBUztnQkFDL0IscUJBQXFCLEVBQUUsSUFBSTtnQkFDM0IsYUFBYSxFQUFFLENBQUM7Z0JBQ2hCLGlCQUFpQixFQUFFLENBQUM7YUFDdkI7WUFDRCxHQUFHLEVBQUU7Z0JBQ0QsT0FBTyxFQUFFLHlCQUF5QjtnQkFDbEMsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLEtBQUssRUFBRSxTQUFTO2dCQUNoQixlQUFlLEVBQUUsUUFBUTtnQkFDekIsc0JBQXNCLEVBQUUsS0FBSztnQkFDN0IsU0FBUyxFQUFF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U0FDeEMsQ0FBQzt5Q0F1Q3FCLHVCQUFjO1lBQ0osbUNBQWU7WUFDdEIsaUJBQVE7T0F2Q3JCLHlCQUF5QixDQXVOckM7SUFBRCxnQ0FBQztDQUFBLEFBdk5ELElBdU5DO0FBdk5ZLDhEQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBTdG9yZUFwcFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vLi4vY29yZS9zZXJ2aWNlcy9zdG9yZS1hcHAuc2VydmljZVwiO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XHJcbmltcG9ydCB7IGdldFN0cmluZywgc2V0U3RyaW5nLCBnZXRCb29sZWFuLCBzZXRCb29sZWFuLCBjbGVhciB9IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlXCI7XHJcbmltcG9ydCB7IExvYWRpbmdJbmRpY2F0b3IgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWxvYWRpbmctaW5kaWNhdG9yXCI7XHJcbmltcG9ydCAqIGFzIEdsb2JhbHMgZnJvbSAnLi4vLi4vLi4vY29yZS9nbG9iYWxzJztcclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3Byb2R1Y3RzJyxcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogYHByb2R1Y3RzLmNvbXBvbmVudC5odG1sYCxcclxuICAgIHN0eWxlVXJsczogW2Bwcm9kdWN0cy5jb21wb25lbnQuY3NzYF1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBTdG9yZUFwcFByb2R1Y3RzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIGFwcF9pZDogc3RyaW5nO1xyXG4gICAgYXBwX2RldGFpbHM6IGFueTtcclxuICAgIGltZ19iYXNlX3VybDpzdHJpbmc7XHJcbiAgICBjYXRlZ29yeV9saXN0OiBhbnkgPSBbXTtcclxuICAgIGFjY29yZGlhbl92aWV3X2tleTogYm9vbGVhbjtcclxuICAgIGxpc3Rfdmlld19rZXk6IGJvb2xlYW47XHJcbiAgICBjdXN0b21lcl9jYXJ0X2RhdGE6IGFueTtcclxuICAgIHNlY3VyZVN0b3JhZ2U6IFNlY3VyZVN0b3JhZ2U7XHJcbiAgICB1c2VyX2lkOiBzdHJpbmc7XHJcbiAgICBsb2FkZXIgPSBuZXcgTG9hZGluZ0luZGljYXRvcigpO1xyXG4gICAgc2VydmljZVR5cGU7XHJcbiAgICBsb2RhaW5nX29wdGlvbnMgPSB7XHJcbiAgICAgICAgbWVzc2FnZTogJ0xvYWRpbmcuLi4nLFxyXG4gICAgICAgIHByb2dyZXNzOiAwLjY1LFxyXG4gICAgICAgIGFuZHJvaWQ6IHtcclxuICAgICAgICAgICAgaW5kZXRlcm1pbmF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhbmNlbExpc3RlbmVyOiBmdW5jdGlvbiAoZGlhbG9nKSB7IGNvbnNvbGUubG9nKFwiTG9hZGluZyBjYW5jZWxsZWRcIikgfSxcclxuICAgICAgICAgICAgbWF4OiAxMDAsXHJcbiAgICAgICAgICAgIHByb2dyZXNzTnVtYmVyRm9ybWF0OiBcIiUxZC8lMmRcIixcclxuICAgICAgICAgICAgcHJvZ3Jlc3NQZXJjZW50Rm9ybWF0OiAwLjUzLFxyXG4gICAgICAgICAgICBwcm9ncmVzc1N0eWxlOiAxLFxyXG4gICAgICAgICAgICBzZWNvbmRhcnlQcm9ncmVzczogMVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW9zOiB7XHJcbiAgICAgICAgICAgIGRldGFpbHM6IFwiQWRkaXRpb25hbCBkZXRhaWwgbm90ZSFcIixcclxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgZGltQmFja2dyb3VuZDogdHJ1ZSxcclxuICAgICAgICAgICAgY29sb3I6IFwiIzRCOUVENlwiLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwieWVsbG93XCIsXHJcbiAgICAgICAgICAgIHVzZXJJbnRlcmFjdGlvbkVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBoaWRlQmV6ZWw6IHRydWUsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVuY3k6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxyXG4gICAgICAgIHByaXZhdGUgc3RvcmVBcHBTZXJ2aWNlOiBTdG9yZUFwcFNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG5cclxuICAgICAgICB0aGlzLmltZ19iYXNlX3VybCA9IEdsb2JhbHMuaW1nX2Jhc2VfdXJsO1xyXG4gICAgICAgIHZhciBmdWxsX2xvY2F0aW9uID0gdGhpcy5sb2NhdGlvbi5wYXRoKCkuc3BsaXQoJy8nKTtcclxuICAgICAgICB0aGlzLmFwcF9pZCA9IGZ1bGxfbG9jYXRpb25bMl0udHJpbSgpO1xyXG4gICAgICAgIHRoaXMudXNlcl9pZCA9IGdldFN0cmluZygndXNlcl9pZCcpO1xyXG4gICAgICAgIHRoaXMuY3VycmVuY3kgPSBHbG9iYWxzLmN1cnJlbmN5XHJcbiAgICAgICAgLy8gdGhpcy5zZWN1cmVTdG9yYWdlLnJlbW92ZSh7XHJcbiAgICAgICAgLy8gICAgIGtleTogXCJjYXJ0XCJcclxuICAgICAgICAvLyB9KS50aGVuKHN1Y2Nlc3MgPT4gY29uc29sZS5sb2coXCJTdWNjZXNzZnVsbHkgcmVtb3ZlZCBhIHZhbHVlPyBcIiArIHN1Y2Nlc3MpKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLmdldCh7XHJcbiAgICAgICAgICAgIGtleTogXCJjYXJ0XCJcclxuICAgICAgICB9KS50aGVuKFxyXG4gICAgICAgICAgICB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGEgPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldEFwcERldGFpbHModGhpcy5hcHBfaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBcHBEZXRhaWxzKGlkKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIuc2hvdyh0aGlzLmxvZGFpbmdfb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5zdG9yZUFwcFNlcnZpY2UuZ2V0U3RvcmVBcHBEZXRhaWxzKGlkKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcF9kZXRhaWxzID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeV9saXN0ID0gdGhpcy5hcHBfZGV0YWlscy5hcHBfcHJvZHVjdF9jYXRlZ29yaWVzO1xyXG5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXBwX2RldGFpbHMuaXNfcHJvZHVjdF9zZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlVHlwZSA9IHRoaXMuYXBwX2RldGFpbHMuaXNfcHJvZHVjdF9zZXJ2aWNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlVHlwZSA9IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYXRlZ29yeV9saXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeV9saXN0W2ldWydpdGVtcyddID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmNhdGVnb3J5X2xpc3RbaV0ucHJvZHVjdHMpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpc0NhcnQgaW1wbGVtZW50ZWRcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuY2F0ZWdvcnlfbGlzdFtpXS5pdGVtcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YS5maW5kSW5kZXgoeSA9PiB5LmFwcF9pZCA9PSB0aGlzLmNhdGVnb3J5X2xpc3RbaV0uaXRlbXNbal0uYXBwX21hc3RlciAmJiB5LnByb2R1Y3RfaWQgPT0gdGhpcy5jYXRlZ29yeV9saXN0W2ldLml0ZW1zW2pdLmlkICYmIHkuY3VzdG9tZXJfaWQgPT0gdGhpcy51c2VyX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeV9saXN0W2ldLml0ZW1zW2pdWydpc0NhcnQnXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhdGVnb3J5X2xpc3RbaV0uaXRlbXNbal1bJ3F1YW50aXR5J10gPSB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YVtpbmRleF0ucXVhbnRpdHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlfbGlzdFtpXS5pdGVtc1tqXVsnaXNDYXJ0J10gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlfbGlzdFtpXS5pdGVtc1tqXVsncXVhbnRpdHknXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNhdGVnb3J5X2xpc3QpXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYXRlZ29yeV9saXN0Lmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjY29yZGlhbl92aWV3X2tleSA9IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY2F0ZWdvcnlfbGlzdC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdF92aWV3X2tleSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGFkZFRvQ2FydChpdGVtKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGN1c3RvbWVyX2lkOiB0aGlzLnVzZXJfaWQsXHJcbiAgICAgICAgICAgIGFwcF9pZDogdGhpcy5hcHBfaWQsXHJcbiAgICAgICAgICAgIHByb2R1Y3RfaWQ6IGl0ZW0uaWQsXHJcbiAgICAgICAgICAgIHByb2R1Y3RfbmFtZTogaXRlbS5wcm9kdWN0X25hbWUsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBpdGVtLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICBwcm9kdWN0X2NvZGU6IGl0ZW0ucHJvZHVjdF9jb2RlLFxyXG4gICAgICAgICAgICBwcmljZTogaXRlbS5wcmljZSxcclxuICAgICAgICAgICAgZGlzY291bnRlZF9wcmljZTogaXRlbS5kaXNjb3VudGVkX3ByaWNlLFxyXG4gICAgICAgICAgICB0YWdzOiBpdGVtLnRhZ3MsXHJcbiAgICAgICAgICAgIHBhY2tpbmdfY2hhcmdlczogaXRlbS5wYWNraW5nX2NoYXJnZXMsXHJcbiAgICAgICAgICAgIGhpZGVfb3JnX3ByaWNlX3N0YXR1czogaXRlbS5oaWRlX29yZ19wcmljZV9zdGF0dXMsXHJcbiAgICAgICAgICAgIHF1YW50aXR5OiBpdGVtLnF1YW50aXR5ICsgMVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YS5maW5kSW5kZXgoeSA9PiB5LmFwcF9pZCA9PSB0aGlzLmFwcF9pZCAmJiB5LnByb2R1Y3RfaWQgPT0gaXRlbS5pZCAmJiB5LmN1c3RvbWVyX2lkID09IHRoaXMudXNlcl9pZCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhdGVnb3J5X2xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhdF9pbmRleCA9IHRoaXMuY2F0ZWdvcnlfbGlzdFtpXS5pdGVtcy5maW5kSW5kZXgoeSA9PiB5LmlkID09IGl0ZW0uaWQgJiYgeS5hcHBfbWFzdGVyID09IHRoaXMuYXBwX2lkKTtcclxuICAgICAgICAgICAgaWYgKGNhdF9pbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeV9saXN0W2ldLml0ZW1zW2NhdF9pbmRleF0uaXNDYXJ0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlfbGlzdFtpXS5pdGVtc1tjYXRfaW5kZXhdLnF1YW50aXR5ID0gaXRlbS5xdWFudGl0eSArIDFcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2F0ZWdvcnlfbGlzdClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q2FydERhdGEoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldENhcnREYXRhKCkge1xyXG4gICAgICAgIHRoaXMuc2VjdXJlU3RvcmFnZS5zZXQoe1xyXG4gICAgICAgICAgICBrZXk6ICdjYXJ0JyxcclxuICAgICAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhKVxyXG4gICAgICAgIH0pLnRoZW4oc3VjY2VzcyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN1Y2Nlc3MpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVjcmVtZW50KGl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbS5xdWFudGl0eSA+IDEpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGEuZmluZEluZGV4KHkgPT4geS5hcHBfaWQgPT0gdGhpcy5hcHBfaWQgJiYgeS5wcm9kdWN0X2lkID09IGl0ZW0uaWQgJiYgeS5jdXN0b21lcl9pZCA9PSB0aGlzLnVzZXJfaWQpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhW2luZGV4XS5xdWFudGl0eSA9IGl0ZW0ucXVhbnRpdHkgLSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDYXJ0RGF0YSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYXRlZ29yeV9saXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2F0X2luZGV4ID0gdGhpcy5jYXRlZ29yeV9saXN0W2ldLml0ZW1zLmZpbmRJbmRleCh5ID0+IHkuaWQgPT0gaXRlbS5pZCAmJiB5LmFwcF9tYXN0ZXIgPT0gdGhpcy5hcHBfaWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhdF9pbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnlfbGlzdFtpXS5pdGVtc1tjYXRfaW5kZXhdLnF1YW50aXR5ID0gaXRlbS5xdWFudGl0eSAtIDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhLmZpbmRJbmRleCh5ID0+IHkuYXBwX2lkID09IHRoaXMuYXBwX2lkICYmIHkucHJvZHVjdF9pZCA9PSBpdGVtLmlkICYmIHkuY3VzdG9tZXJfaWQgPT0gdGhpcy51c2VyX2lkKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDYXJ0RGF0YSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYXRlZ29yeV9saXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2F0X2luZGV4ID0gdGhpcy5jYXRlZ29yeV9saXN0W2ldLml0ZW1zLmZpbmRJbmRleCh5ID0+IHkuaWQgPT0gaXRlbS5pZCAmJiB5LmFwcF9tYXN0ZXIgPT0gdGhpcy5hcHBfaWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhdF9pbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2F0X2luZGV4XCIgKyBjYXRfaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeV9saXN0W2ldLml0ZW1zW2NhdF9pbmRleF0uaXNDYXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeV9saXN0W2ldLml0ZW1zW2NhdF9pbmRleF0ucXVhbnRpdHkgPSBpdGVtLnF1YW50aXR5IC0gMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNhdGVnb3J5X2xpc3QpXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBpbmNyZW1lbnQoaXRlbSkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhLmZpbmRJbmRleCh5ID0+IHkuYXBwX2lkID09IHRoaXMuYXBwX2lkICYmIHkucHJvZHVjdF9pZCA9PSBpdGVtLmlkICYmIHkuY3VzdG9tZXJfaWQgPT0gdGhpcy51c2VyX2lkKTtcclxuICAgICAgICBpZiAoaW5kZXggIT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGFbaW5kZXhdLnF1YW50aXR5ID0gaXRlbS5xdWFudGl0eSArIDE7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q2FydERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhdGVnb3J5X2xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhdF9pbmRleCA9IHRoaXMuY2F0ZWdvcnlfbGlzdFtpXS5pdGVtcy5maW5kSW5kZXgoeSA9PiB5LmlkID09IGl0ZW0uaWQgJiYgeS5hcHBfbWFzdGVyID09IHRoaXMuYXBwX2lkKTtcclxuICAgICAgICAgICAgaWYgKGNhdF9pbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yeV9saXN0W2ldLml0ZW1zW2NhdF9pbmRleF0ucXVhbnRpdHkgPSBpdGVtLnF1YW50aXR5ICsgMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNjb3VudChwcmljZSwgZGlzY291bnRlZF9wcmljZSkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgocHJpY2UgLSBkaXNjb3VudGVkX3ByaWNlKSAqIDEwMCkgLyBwcmljZSkgKyAnJSc7XHJcbiAgICB9XHJcbn0iXX0=