"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var application_settings_1 = require("application-settings");
var store_app_service_1 = require("../../../core/services/store-app.service");
var router_2 = require("@angular/router");
var forms_1 = require("@angular/forms");
var nativescript_drop_down_1 = require("nativescript-drop-down");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
var nativescript_paytm_1 = require("@nstudio/nativescript-paytm");
var dialogs = require("ui/dialogs");
var Globals = require("../../../core/globals");
var StoreAppPaymentComponent = /** @class */ (function () {
    function StoreAppPaymentComponent(route, location, storeAppService, router, formBuilder) {
        this.route = route;
        this.location = location;
        this.storeAppService = storeAppService;
        this.router = router;
        this.formBuilder = formBuilder;
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
        this.customer_adress_list = [];
        this.loader = new nativescript_loading_indicator_1.LoadingIndicator();
        this.lodaing_options = {
            message: 'Loading...',
            progress: 0.65,
            android: {
                indeterminate: true,
                cancelable: true,
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
    StoreAppPaymentComponent.prototype.ngOnInit = function () {
        this.loader.show(this.lodaing_options);
        this.currency = Globals.currency;
        var full_location = this.location.path().split('/');
        this.app_id = full_location[2].trim();
        this.user_id = application_settings_1.getString('user_id');
        this.populateData();
        this.paytm = new nativescript_paytm_1.Paytm();
        this.getCustomerAdressList(this.user_id);
        this.getStateList();
        this.form = this.formBuilder.group({
            address: ['', forms_1.Validators.required],
            state: ['', forms_1.Validators.required],
            pincode: ['', forms_1.Validators.required],
            customer: [this.user_id, forms_1.Validators.required]
        });
        this.getAppDetails(this.app_id);
    };
    StoreAppPaymentComponent.prototype.getAppDetails = function (id) {
        var _this = this;
        this.storeAppService.getStoreAppDetails(id).subscribe(function (res) {
            if (res['is_paytm_enabled'] == 1) {
                _this.is_paytm_enabled = true;
                _this.paymentOptions = [
                    new store_app_service_1.RadioOption("Paytm", 0),
                    new store_app_service_1.RadioOption("Cash On Delivery", 1)
                ];
            }
            else {
                _this.is_paytm_enabled = false;
                _this.paymentOptions = [
                    new store_app_service_1.RadioOption("Cash On Delivery", 1)
                ];
            }
            _this.paymentOptions[0]['selected'] = true;
            _this.payment_type = _this.paymentOptions[0]['id'];
            _this.loader.hide();
        }, function (error) {
            _this.loader.hide();
            console.log(error);
        });
    };
    StoreAppPaymentComponent.prototype.changeCheckedRadioPaymentMode = function (radioOption) {
        radioOption.selected = !radioOption.selected;
        this.payment_type = radioOption.id;
        if (!radioOption.selected) {
            return;
        }
        // uncheck all other options
        this.paymentOptions.forEach(function (option) {
            if (option.text !== radioOption.text) {
                option.selected = false;
            }
        });
        console.log(this.payment_type);
    };
    StoreAppPaymentComponent.prototype.changeCheckedRadio = function (radioOption) {
        radioOption.selected = !radioOption.selected;
        this.address_id = radioOption.id;
        if (!radioOption.selected) {
            return;
        }
        // uncheck all other options
        this.radioOptions.forEach(function (option) {
            if (option.text !== radioOption.text) {
                option.selected = false;
            }
        });
        console.log(this.address_id);
    };
    StoreAppPaymentComponent.prototype.populateData = function () {
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
            }
        });
    };
    StoreAppPaymentComponent.prototype.getCustomerAdressList = function (id) {
        var _this = this;
        this.storeAppService.getCustomerAddress(id).subscribe(function (res) {
            console.log(res);
            _this.customer_adress_list = res;
            _this.radioOptions = [];
            _this.customer_adress_list.forEach(function (x) {
                var d = new store_app_service_1.RadioOption(x.address, x.id);
                _this.radioOptions.push(d);
            });
            _this.radioOptions[0]['selected'] = true;
            _this.address_id = _this.radioOptions[0]['id'];
        }, function (error) {
            console.log(error);
        });
    };
    StoreAppPaymentComponent.prototype.getStateList = function () {
        var _this = this;
        this.storeAppService.getStateList().subscribe(function (res) {
            console.log(res);
            _this.state_list = new nativescript_drop_down_1.ValueList();
            for (var i = 0; i < res.length; i++) {
                _this.state_list.push({
                    value: res[i]['id'],
                    display: res[i]['state_name'],
                });
            }
        }, function (error) {
            console.log(error);
        });
    };
    StoreAppPaymentComponent.prototype.getDiscount = function (price, discounted_price) {
        return Math.floor(((price - discounted_price) * 100) / price) + '%';
    };
    StoreAppPaymentComponent.prototype.getTotalItemPrice = function () {
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
    StoreAppPaymentComponent.prototype.getTotalPackingPrice = function () {
        var _this = this;
        this.total_packing_price = 0;
        this.customer_cart_data.forEach(function (x) {
            _this.total_packing_price += x.packing_charges;
        });
    };
    StoreAppPaymentComponent.prototype.setCartData = function () {
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
    StoreAppPaymentComponent.prototype.onchange = function (args) {
        this.form.patchValue({
            state: this.state_list.getValue(args.newIndex)
        });
    };
    StoreAppPaymentComponent.prototype.addAdressBox = function () {
        this.address_box_key = true;
    };
    StoreAppPaymentComponent.prototype.addAdress = function () {
        var _this = this;
        console.log(this.form.value);
        if (this.form.valid) {
            this.loader.show(this.lodaing_options);
            this.storeAppService.addCustomerAddress(this.form.value).subscribe(function (res) {
                _this.loader.hide();
                console.log(res);
                _this.address_box_key = false;
                _this.getCustomerAdressList(_this.user_id);
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this.markFormGroupTouched(this.form);
        }
    };
    StoreAppPaymentComponent.prototype.cancel = function () {
        this.address_box_key = false;
    };
    StoreAppPaymentComponent.prototype.isFieldValid = function (field) {
        return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
    };
    StoreAppPaymentComponent.prototype.displayFieldCss = function (field) {
        return {
            'is-invalid': this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched),
            'is-valid': this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched)
        };
    };
    StoreAppPaymentComponent.prototype.markFormGroupTouched = function (formGroup) {
        var _this = this;
        Object.values(formGroup.controls).forEach(function (control) {
            control.markAsTouched();
            if (control.controls) {
                control.controls.forEach(function (c) { return _this.markFormGroupTouched(c); });
            }
        });
    };
    StoreAppPaymentComponent.prototype.orderPay = function () {
        var _this = this;
        if (this.address_id == undefined) {
            dialogs.alert("Please Select Shipping Address").then(function () {
                console.log("Dialog closed!");
            });
        }
        else {
            this.loader.show(this.lodaing_options);
            this.order.customer = this.user_id;
            this.order.price = this.total_item_price + this.total_packing_price;
            this.order.address = this.address_id;
            this.order.appmaster = this.app_id;
            this.order.payment_type = this.payment_type;
            var all_details_data = [];
            this.customer_cart_data.forEach(function (x) {
                var details_data = new store_app_service_1.OrderDetails();
                console.log(x);
                details_data.appmaster = x.app_id;
                if (x.discounted_price > 0) {
                    details_data.unit_price = x.discounted_price;
                }
                else {
                    details_data.unit_price = x.price;
                }
                details_data.quantity = x.quantity;
                details_data.product = x.product_id;
                details_data.packaging_cost = x.packing_charges;
                details_data.uom = "0";
                details_data.IGST = "0";
                details_data.CGST = "0";
                all_details_data.push(details_data);
                var index = _this.all_cart_data.findIndex(function (y) { return y.customer_id == _this.user_id && y.app_id == _this.app_id && y.product_id == x.product_id; });
                if (index != -1) {
                    _this.all_cart_data.splice(index, 1);
                }
            });
            this.order.order_details = all_details_data;
            // console.log(JSON.stringify(this.order));
            this.setCartData();
            this.storeAppService.createOrder(this.order).subscribe(function (res) {
                console.log(res);
                if (_this.payment_type == 1) {
                    _this.loader.hide();
                    _this.router.navigate(['/store-app/', _this.app_id, 'payment-success', res['id']]);
                }
                else {
                    _this.getPaytmFormValue(_this.order.price);
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    StoreAppPaymentComponent.prototype.getPaytmFormValue = function (amount) {
        var _this = this;
        this.storeAppService.paytmFormValue(amount).subscribe(function (res) {
            console.log(res);
            _this.paytmFormDetails = res;
            _this.loader.hide();
            _this.payViaPaytm();
        }, function (error) {
            console.log(error);
        });
    };
    // paytm
    StoreAppPaymentComponent.prototype.payViaPaytm = function () {
        this.paytm.setIOSCallbacks({
            didFinishedResponse: function (response) {
                console.log(response);
            },
            didCancelTransaction: function () {
                console.log("User cancelled transaction");
            },
            errorMissingParameterError: function (error) {
                console.log(error);
            }
        });
        this.orderToPaytm = {
            MID: this.paytmFormDetails['MID'],
            ORDER_ID: this.paytmFormDetails['ORDER_ID'],
            CUST_ID: this.paytmFormDetails['CUST_ID'],
            INDUSTRY_TYPE_ID: this.paytmFormDetails['INDUSTRY_TYPE_ID'],
            CHANNEL_ID: this.paytmFormDetails['CHANNEL_ID'],
            TXN_AMOUNT: this.paytmFormDetails['TXN_AMOUNT'],
            WEBSITE: this.paytmFormDetails['WEBSITE'],
            CALLBACK_URL: this.paytmFormDetails['CALLBACK_URL'],
            CHECKSUMHASH: this.paytmFormDetails['CHECKSUMHASH']
        };
        console.log(new Date());
        console.log("sdassdas");
        this.paytm.createOrder(this.orderToPaytm);
        this.paytm.initialize("STAGING");
        this.paytm.startPaymentTransaction({
            someUIErrorOccurred: function (inErrorMessage) {
                console.log("1");
                console.log(inErrorMessage);
            },
            onTransactionResponse: function (inResponse) {
                console.log("2");
                console.log(inResponse);
            },
            networkNotAvailable: function () {
                console.log("3");
                console.log("Network not available");
            },
            clientAuthenticationFailed: function (inErrorMessage) {
                console.log("4");
                console.log(inErrorMessage);
            },
            onErrorLoadingWebPage: function (iniErrorCode, inErrorMessage, inFailingUrl) {
                console.log("5");
                console.log(iniErrorCode, inErrorMessage, inFailingUrl);
            },
            onBackPressedCancelTransaction: function () {
                console.log("6");
                console.log("User cancelled transaction by pressing back button");
            },
            onTransactionCancel: function (inErrorMessage, inResponse) {
                console.log("7");
                console.log(inErrorMessage, inResponse);
            }
        });
    };
    StoreAppPaymentComponent = __decorate([
        core_1.Component({
            selector: 'payment',
            moduleId: module.id,
            templateUrl: "payment.component.html",
            styleUrls: ["payment.component.css"]
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            common_1.Location,
            store_app_service_1.StoreAppService,
            router_2.Router,
            forms_1.FormBuilder])
    ], StoreAppPaymentComponent);
    return StoreAppPaymentComponent;
}());
exports.StoreAppPaymentComponent = StoreAppPaymentComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXltZW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUNsRCwwQ0FBaUQ7QUFDakQsMENBQTJDO0FBQzNDLDJFQUE0RDtBQUM1RCw2REFBMkY7QUFDM0YsOEVBQW1IO0FBQ25ILDBDQUF5QztBQUN6Qyx3Q0FBb0U7QUFDcEUsaUVBQWtGO0FBQ2xGLGlGQUFrRTtBQUNsRSxrRUFLcUM7QUFDckMsb0NBQXNDO0FBQ3RDLCtDQUFpRDtBQVFqRDtJQTJESSxrQ0FDWSxLQUFxQixFQUNyQixRQUFrQixFQUNsQixlQUFnQyxFQUNoQyxNQUFjLEVBQ2QsV0FBd0I7UUFKeEIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBbkRwQyxpQkFBWSxHQUFVO1lBQ2xCLEdBQUcsRUFBRSxFQUFFO1lBQ1AsUUFBUSxFQUFFLEVBQUU7WUFDWixPQUFPLEVBQUUsRUFBRTtZQUNYLGdCQUFnQixFQUFFLEVBQUU7WUFDcEIsVUFBVSxFQUFFLEVBQUU7WUFDZCxVQUFVLEVBQUUsRUFBRTtZQUNkLE9BQU8sRUFBRSxFQUFFO1lBQ1gsWUFBWSxFQUFFLEVBQUU7WUFDaEIsWUFBWSxFQUFFLEVBQUU7U0FDbkIsQ0FBQztRQUdGLHlCQUFvQixHQUFRLEVBQUUsQ0FBQztRQUkvQixXQUFNLEdBQUcsSUFBSSxpREFBZ0IsRUFBRSxDQUFDO1FBQ2hDLG9CQUFlLEdBQUc7WUFDZCxPQUFPLEVBQUUsWUFBWTtZQUNyQixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRTtnQkFDTCxhQUFhLEVBQUUsSUFBSTtnQkFDbkIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLGNBQWMsRUFB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Y0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzVDLENBQUM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBM2JRLHdCQUF3QjtRQU5wQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFNBQVM7WUFDbkIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUM7U0FDdkMsQ0FBQzt5Q0E2RHFCLHVCQUFjO1lBQ1gsaUJBQVE7WUFDRCxtQ0FBZTtZQUN4QixlQUFNO1lBQ0QsbUJBQVc7T0FoRTNCLHdCQUF3QixDQTRicEM7SUFBRCwrQkFBQztDQUFBLEFBNWJELElBNGJDO0FBNWJZLDREQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XHJcbmltcG9ydCB7IGdldFN0cmluZywgc2V0U3RyaW5nLCBnZXRCb29sZWFuLCBzZXRCb29sZWFuLCBjbGVhciB9IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBTdG9yZUFwcFNlcnZpY2UsIE9yZGVyTW9kdWxlLCBPcmRlckRldGFpbHMsIFJhZGlvT3B0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL2NvcmUvc2VydmljZXMvc3RvcmUtYXBwLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBTZWxlY3RlZEluZGV4Q2hhbmdlZEV2ZW50RGF0YSwgVmFsdWVMaXN0IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd25cIjtcclxuaW1wb3J0IHsgTG9hZGluZ0luZGljYXRvciB9IGZyb20gXCJuYXRpdmVzY3JpcHQtbG9hZGluZy1pbmRpY2F0b3JcIjtcclxuaW1wb3J0IHtcclxuICAgIFBheXRtLFxyXG4gICAgT3JkZXIsXHJcbiAgICBUcmFuc2FjdGlvbkNhbGxiYWNrLFxyXG4gICAgSU9TQ2FsbGJhY2tcclxufSBmcm9tIFwiQG5zdHVkaW8vbmF0aXZlc2NyaXB0LXBheXRtXCI7XHJcbmltcG9ydCAqIGFzIGRpYWxvZ3MgZnJvbSBcInVpL2RpYWxvZ3NcIjtcclxuaW1wb3J0ICogYXMgR2xvYmFscyBmcm9tICcuLi8uLi8uLi9jb3JlL2dsb2JhbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3BheW1lbnQnLFxyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHRlbXBsYXRlVXJsOiBgcGF5bWVudC5jb21wb25lbnQuaHRtbGAsXHJcbiAgICBzdHlsZVVybHM6IFtgcGF5bWVudC5jb21wb25lbnQuY3NzYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFN0b3JlQXBwUGF5bWVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgICBhcHBfaWQ6IHN0cmluZztcclxuICAgIHNlY3VyZVN0b3JhZ2U6IFNlY3VyZVN0b3JhZ2U7XHJcbiAgICBjdXN0b21lcl9jYXJ0X2RhdGE6IGFueTtcclxuICAgIHVzZXJfaWQ6IHN0cmluZztcclxuICAgIHZpc2libGVfa2V5OiBib29sZWFuO1xyXG4gICAgdG90YWxfaXRlbV9wcmljZTogbnVtYmVyO1xyXG4gICAgdG90YWxfcGFja2luZ19wcmljZTogbnVtYmVyO1xyXG4gICAgdG90YWxfcHJpY2U6IG51bWJlcjtcclxuICAgIGFsbF9jYXJ0X2RhdGE6IGFueTtcclxuICAgIG9yZGVyOiBPcmRlck1vZHVsZTtcclxuICAgIHBheXRtRm9ybURldGFpbHM6IGFueTtcclxuICAgIHBheXRtOiBQYXl0bTtcclxuICAgIG9yZGVyVG9QYXl0bTogT3JkZXIgPSB7XHJcbiAgICAgICAgTUlEOiBcIlwiLFxyXG4gICAgICAgIE9SREVSX0lEOiBcIlwiLFxyXG4gICAgICAgIENVU1RfSUQ6IFwiXCIsXHJcbiAgICAgICAgSU5EVVNUUllfVFlQRV9JRDogXCJcIixcclxuICAgICAgICBDSEFOTkVMX0lEOiBcIlwiLFxyXG4gICAgICAgIFRYTl9BTU9VTlQ6IFwiXCIsXHJcbiAgICAgICAgV0VCU0lURTogXCJcIixcclxuICAgICAgICBDQUxMQkFDS19VUkw6IFwiXCIsXHJcbiAgICAgICAgQ0hFQ0tTVU1IQVNIOiBcIlwiXHJcbiAgICB9O1xyXG5cclxuICAgIHJhZGlvT3B0aW9ucz86IEFycmF5PFJhZGlvT3B0aW9uPjtcclxuICAgIGN1c3RvbWVyX2FkcmVzc19saXN0OiBhbnkgPSBbXTtcclxuICAgIHN0YXRlX2xpc3Q6IFZhbHVlTGlzdDxzdHJpbmc+O1xyXG4gICAgZm9ybTogRm9ybUdyb3VwO1xyXG4gICAgYWRkcmVzc19ib3hfa2V5OiBib29sZWFuO1xyXG4gICAgbG9hZGVyID0gbmV3IExvYWRpbmdJbmRpY2F0b3IoKTtcclxuICAgIGxvZGFpbmdfb3B0aW9ucyA9IHtcclxuICAgICAgICBtZXNzYWdlOiAnTG9hZGluZy4uLicsXHJcbiAgICAgICAgcHJvZ3Jlc3M6IDAuNjUsXHJcbiAgICAgICAgYW5kcm9pZDoge1xyXG4gICAgICAgICAgICBpbmRldGVybWluYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYW5jZWxMaXN0ZW5lcjogZnVuY3Rpb24gKGRpYWxvZykgeyBjb25zb2xlLmxvZyhcIkxvYWRpbmcgY2FuY2VsbGVkXCIpIH0sXHJcbiAgICAgICAgICAgIG1heDogMTAwLFxyXG4gICAgICAgICAgICBwcm9ncmVzc051bWJlckZvcm1hdDogXCIlMWQvJTJkXCIsXHJcbiAgICAgICAgICAgIHByb2dyZXNzUGVyY2VudEZvcm1hdDogMC41MyxcclxuICAgICAgICAgICAgcHJvZ3Jlc3NTdHlsZTogMSxcclxuICAgICAgICAgICAgc2Vjb25kYXJ5UHJvZ3Jlc3M6IDFcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlvczoge1xyXG4gICAgICAgICAgICBkZXRhaWxzOiBcIkFkZGl0aW9uYWwgZGV0YWlsIG5vdGUhXCIsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgICAgIGRpbUJhY2tncm91bmQ6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbG9yOiBcIiM0QjlFRDZcIixcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInllbGxvd1wiLFxyXG4gICAgICAgICAgICB1c2VySW50ZXJhY3Rpb25FbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgaGlkZUJlemVsOiB0cnVlLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZHJlc3NfaWQ6IG51bWJlcjtcclxuICAgIHBheW1lbnRfdHlwZTogbnVtYmVyO1xyXG4gICAgcGF5bWVudE9wdGlvbnM6IEFycmF5PFJhZGlvT3B0aW9uPjtcclxuICAgIGlzX3BheXRtX2VuYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBjdXJyZW5jeTogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sXHJcbiAgICAgICAgcHJpdmF0ZSBzdG9yZUFwcFNlcnZpY2U6IFN0b3JlQXBwU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxyXG4gICAgICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xyXG4gICAgICAgIHRoaXMub3JkZXIgPSBuZXcgT3JkZXJNb2R1bGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLmxvYWRlci5zaG93KHRoaXMubG9kYWluZ19vcHRpb25zKTtcclxuICAgICAgICB0aGlzLmN1cnJlbmN5ID0gR2xvYmFscy5jdXJyZW5jeVxyXG4gICAgICAgIHZhciBmdWxsX2xvY2F0aW9uID0gdGhpcy5sb2NhdGlvbi5wYXRoKCkuc3BsaXQoJy8nKTtcclxuICAgICAgICB0aGlzLmFwcF9pZCA9IGZ1bGxfbG9jYXRpb25bMl0udHJpbSgpO1xyXG4gICAgICAgIHRoaXMudXNlcl9pZCA9IGdldFN0cmluZygndXNlcl9pZCcpO1xyXG4gICAgICAgIHRoaXMucG9wdWxhdGVEYXRhKCk7XHJcbiAgICAgICAgdGhpcy5wYXl0bSA9IG5ldyBQYXl0bSgpO1xyXG4gICAgICAgIHRoaXMuZ2V0Q3VzdG9tZXJBZHJlc3NMaXN0KHRoaXMudXNlcl9pZCk7XHJcbiAgICAgICAgdGhpcy5nZXRTdGF0ZUxpc3QoKTtcclxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcclxuICAgICAgICAgICAgYWRkcmVzczogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcclxuICAgICAgICAgICAgc3RhdGU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXHJcbiAgICAgICAgICAgIHBpbmNvZGU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXHJcbiAgICAgICAgICAgIGN1c3RvbWVyOiBbdGhpcy51c2VyX2lkLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdldEFwcERldGFpbHModGhpcy5hcHBfaWQpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXBwRGV0YWlscyhpZCkge1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JlQXBwU2VydmljZS5nZXRTdG9yZUFwcERldGFpbHMoaWQpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNbJ2lzX3BheXRtX2VuYWJsZWQnXSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc19wYXl0bV9lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBheW1lbnRPcHRpb25zID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUmFkaW9PcHRpb24oXCJQYXl0bVwiLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFJhZGlvT3B0aW9uKFwiQ2FzaCBPbiBEZWxpdmVyeVwiLCAxKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNfcGF5dG1fZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF5bWVudE9wdGlvbnMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBSYWRpb09wdGlvbihcIkNhc2ggT24gRGVsaXZlcnlcIiwgMSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBheW1lbnRPcHRpb25zWzBdWydzZWxlY3RlZCddID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGF5bWVudF90eXBlID0gdGhpcy5wYXltZW50T3B0aW9uc1swXVsnaWQnXTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGUoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlKClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZUNoZWNrZWRSYWRpb1BheW1lbnRNb2RlKHJhZGlvT3B0aW9uOiBSYWRpb09wdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHJhZGlvT3B0aW9uLnNlbGVjdGVkID0gIXJhZGlvT3B0aW9uLnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMucGF5bWVudF90eXBlID0gcmFkaW9PcHRpb24uaWRcclxuICAgICAgICBpZiAoIXJhZGlvT3B0aW9uLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHVuY2hlY2sgYWxsIG90aGVyIG9wdGlvbnNcclxuICAgICAgICB0aGlzLnBheW1lbnRPcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbi50ZXh0ICE9PSByYWRpb09wdGlvbi50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucGF5bWVudF90eXBlKVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZUNoZWNrZWRSYWRpbyhyYWRpb09wdGlvbjogUmFkaW9PcHRpb24pOiB2b2lkIHtcclxuICAgICAgICByYWRpb09wdGlvbi5zZWxlY3RlZCA9ICFyYWRpb09wdGlvbi5zZWxlY3RlZDtcclxuICAgICAgICB0aGlzLmFkZHJlc3NfaWQgPSByYWRpb09wdGlvbi5pZFxyXG4gICAgICAgIGlmICghcmFkaW9PcHRpb24uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdW5jaGVjayBhbGwgb3RoZXIgb3B0aW9uc1xyXG4gICAgICAgIHRoaXMucmFkaW9PcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbi50ZXh0ICE9PSByYWRpb09wdGlvbi50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYWRkcmVzc19pZClcclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZURhdGEoKSB7XHJcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLmdldCh7XHJcbiAgICAgICAgICAgIGtleTogXCJjYXJ0XCJcclxuICAgICAgICB9KS50aGVuKFxyXG4gICAgICAgICAgICB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxfY2FydF9kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmlsdGVyZWREYXRhID0gZGF0YS5maWx0ZXIoeCA9PiB4LmN1c3RvbWVyX2lkID09IHRoaXMudXNlcl9pZCAmJiB4LmFwcF9pZCA9PSB0aGlzLmFwcF9pZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YSA9IGZpbHRlcmVkRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFRvdGFsSXRlbVByaWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRUb3RhbFBhY2tpbmdQcmljZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlzaWJsZV9rZXkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXN0b21lcl9jYXJ0X2RhdGEgPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q3VzdG9tZXJBZHJlc3NMaXN0KGlkKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZUFwcFNlcnZpY2UuZ2V0Q3VzdG9tZXJBZGRyZXNzKGlkKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIChyZXM6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXN0b21lcl9hZHJlc3NfbGlzdCA9IHJlcztcclxuICAgICAgICAgICAgICAgIHRoaXMucmFkaW9PcHRpb25zID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXN0b21lcl9hZHJlc3NfbGlzdC5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IFJhZGlvT3B0aW9uKHguYWRkcmVzcywgeC5pZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJhZGlvT3B0aW9ucy5wdXNoKGQpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yYWRpb09wdGlvbnNbMF1bJ3NlbGVjdGVkJ10gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRyZXNzX2lkID0gdGhpcy5yYWRpb09wdGlvbnNbMF1bJ2lkJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3RhdGVMaXN0KCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmVBcHBTZXJ2aWNlLmdldFN0YXRlTGlzdCgpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgKHJlczogYW55W10pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlX2xpc3QgPSBuZXcgVmFsdWVMaXN0PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZV9saXN0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzW2ldWydpZCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiByZXNbaV1bJ3N0YXRlX25hbWUnXSxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzY291bnQocHJpY2UsIGRpc2NvdW50ZWRfcHJpY2UpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoKHByaWNlIC0gZGlzY291bnRlZF9wcmljZSkgKiAxMDApIC8gcHJpY2UpICsgJyUnO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgZ2V0VG90YWxJdGVtUHJpY2UoKSB7XHJcbiAgICAgICAgdGhpcy50b3RhbF9pdGVtX3ByaWNlID0gMDtcclxuICAgICAgICB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YS5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICBpZiAoeC5kaXNjb3VudGVkX3ByaWNlID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbF9pdGVtX3ByaWNlICs9ICh4LmRpc2NvdW50ZWRfcHJpY2UgKiB4LnF1YW50aXR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG90YWxfaXRlbV9wcmljZSArPSAoeC5wcmljZSAqIHgucXVhbnRpdHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBnZXRUb3RhbFBhY2tpbmdQcmljZSgpIHtcclxuICAgICAgICB0aGlzLnRvdGFsX3BhY2tpbmdfcHJpY2UgPSAwO1xyXG4gICAgICAgIHRoaXMuY3VzdG9tZXJfY2FydF9kYXRhLmZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudG90YWxfcGFja2luZ19wcmljZSArPSB4LnBhY2tpbmdfY2hhcmdlcztcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2V0Q2FydERhdGEoKSB7XHJcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnNldCh7XHJcbiAgICAgICAgICAgIGtleTogJ2NhcnQnLFxyXG4gICAgICAgICAgICB2YWx1ZTogSlNPTi5zdHJpbmdpZnkodGhpcy5hbGxfY2FydF9kYXRhKVxyXG4gICAgICAgIH0pLnRoZW4oc3VjY2VzcyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0VG90YWxJdGVtUHJpY2UoKTtcclxuICAgICAgICAgICAgdGhpcy5nZXRUb3RhbFBhY2tpbmdQcmljZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uY2hhbmdlKGFyZ3M6IFNlbGVjdGVkSW5kZXhDaGFuZ2VkRXZlbnREYXRhKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtLnBhdGNoVmFsdWUoe1xyXG4gICAgICAgICAgICBzdGF0ZTogdGhpcy5zdGF0ZV9saXN0LmdldFZhbHVlKGFyZ3MubmV3SW5kZXgpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhZGRBZHJlc3NCb3goKSB7XHJcbiAgICAgICAgdGhpcy5hZGRyZXNzX2JveF9rZXkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEFkcmVzcygpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm0udmFsdWUpXHJcbiAgICAgICAgaWYgKHRoaXMuZm9ybS52YWxpZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlci5zaG93KHRoaXMubG9kYWluZ19vcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUFwcFNlcnZpY2UuYWRkQ3VzdG9tZXJBZGRyZXNzKHRoaXMuZm9ybS52YWx1ZSkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkcmVzc19ib3hfa2V5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDdXN0b21lckFkcmVzc0xpc3QodGhpcy51c2VyX2lkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1hcmtGb3JtR3JvdXBUb3VjaGVkKHRoaXMuZm9ybSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2FuY2VsKCkge1xyXG4gICAgICAgIHRoaXMuYWRkcmVzc19ib3hfa2V5ID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNGaWVsZFZhbGlkKGZpZWxkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuZm9ybS5nZXQoZmllbGQpLnZhbGlkICYmICh0aGlzLmZvcm0uZ2V0KGZpZWxkKS5kaXJ0eSB8fCB0aGlzLmZvcm0uZ2V0KGZpZWxkKS50b3VjaGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwbGF5RmllbGRDc3MoZmllbGQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICdpcy1pbnZhbGlkJzogdGhpcy5mb3JtLmdldChmaWVsZCkuaW52YWxpZCAmJiAodGhpcy5mb3JtLmdldChmaWVsZCkuZGlydHkgfHwgdGhpcy5mb3JtLmdldChmaWVsZCkudG91Y2hlZCksXHJcbiAgICAgICAgICAgICdpcy12YWxpZCc6IHRoaXMuZm9ybS5nZXQoZmllbGQpLnZhbGlkICYmICh0aGlzLmZvcm0uZ2V0KGZpZWxkKS5kaXJ0eSB8fCB0aGlzLmZvcm0uZ2V0KGZpZWxkKS50b3VjaGVkKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgbWFya0Zvcm1Hcm91cFRvdWNoZWQoZm9ybUdyb3VwOiBGb3JtR3JvdXApIHtcclxuICAgICAgICAoPGFueT5PYmplY3QpLnZhbHVlcyhmb3JtR3JvdXAuY29udHJvbHMpLmZvckVhY2goY29udHJvbCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbC5jb250cm9scykge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbC5jb250cm9scy5mb3JFYWNoKGMgPT4gdGhpcy5tYXJrRm9ybUdyb3VwVG91Y2hlZChjKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb3JkZXJQYXkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWRkcmVzc19pZCA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZGlhbG9ncy5hbGVydChcIlBsZWFzZSBTZWxlY3QgU2hpcHBpbmcgQWRkcmVzc1wiKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGlhbG9nIGNsb3NlZCFcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXIuc2hvdyh0aGlzLmxvZGFpbmdfb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMub3JkZXIuY3VzdG9tZXIgPSB0aGlzLnVzZXJfaWQ7XHJcbiAgICAgICAgICAgIHRoaXMub3JkZXIucHJpY2UgPSB0aGlzLnRvdGFsX2l0ZW1fcHJpY2UgKyB0aGlzLnRvdGFsX3BhY2tpbmdfcHJpY2U7XHJcbiAgICAgICAgICAgIHRoaXMub3JkZXIuYWRkcmVzcyA9IHRoaXMuYWRkcmVzc19pZDtcclxuICAgICAgICAgICAgdGhpcy5vcmRlci5hcHBtYXN0ZXIgPSB0aGlzLmFwcF9pZFxyXG4gICAgICAgICAgICB0aGlzLm9yZGVyLnBheW1lbnRfdHlwZSA9IHRoaXMucGF5bWVudF90eXBlO1xyXG4gICAgICAgICAgICB2YXIgYWxsX2RldGFpbHNfZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbWVyX2NhcnRfZGF0YS5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRldGFpbHNfZGF0YSA9IG5ldyBPcmRlckRldGFpbHMoKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHgpXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzX2RhdGEuYXBwbWFzdGVyID0geC5hcHBfaWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoeC5kaXNjb3VudGVkX3ByaWNlID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbHNfZGF0YS51bml0X3ByaWNlID0geC5kaXNjb3VudGVkX3ByaWNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsc19kYXRhLnVuaXRfcHJpY2UgPSB4LnByaWNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGV0YWlsc19kYXRhLnF1YW50aXR5ID0geC5xdWFudGl0eTtcclxuICAgICAgICAgICAgICAgIGRldGFpbHNfZGF0YS5wcm9kdWN0ID0geC5wcm9kdWN0X2lkO1xyXG4gICAgICAgICAgICAgICAgZGV0YWlsc19kYXRhLnBhY2thZ2luZ19jb3N0ID0geC5wYWNraW5nX2NoYXJnZXM7XHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzX2RhdGEudW9tID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzX2RhdGEuSUdTVCA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgZGV0YWlsc19kYXRhLkNHU1QgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgIGFsbF9kZXRhaWxzX2RhdGEucHVzaChkZXRhaWxzX2RhdGEpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5hbGxfY2FydF9kYXRhLmZpbmRJbmRleCh5ID0+IHkuY3VzdG9tZXJfaWQgPT0gdGhpcy51c2VyX2lkICYmIHkuYXBwX2lkID09IHRoaXMuYXBwX2lkICYmIHkucHJvZHVjdF9pZCA9PSB4LnByb2R1Y3RfaWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxfY2FydF9kYXRhLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMub3JkZXIub3JkZXJfZGV0YWlscyA9IGFsbF9kZXRhaWxzX2RhdGE7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMub3JkZXIpKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRDYXJ0RGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlQXBwU2VydmljZS5jcmVhdGVPcmRlcih0aGlzLm9yZGVyKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXltZW50X3R5cGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL3N0b3JlLWFwcC8nLCB0aGlzLmFwcF9pZCwgJ3BheW1lbnQtc3VjY2VzcycsIHJlc1snaWQnXV0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFBheXRtRm9ybVZhbHVlKHRoaXMub3JkZXIucHJpY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF5dG1Gb3JtVmFsdWUoYW1vdW50OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnN0b3JlQXBwU2VydmljZS5wYXl0bUZvcm1WYWx1ZShhbW91bnQpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgIHRoaXMucGF5dG1Gb3JtRGV0YWlscyA9IHJlcztcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGF5VmlhUGF5dG0oKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGF5dG1cclxuICAgIHBheVZpYVBheXRtKCkge1xyXG4gICAgICAgIHRoaXMucGF5dG0uc2V0SU9TQ2FsbGJhY2tzKHtcclxuICAgICAgICAgICAgZGlkRmluaXNoZWRSZXNwb25zZTogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpZENhbmNlbFRyYW5zYWN0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgY2FuY2VsbGVkIHRyYW5zYWN0aW9uXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvck1pc3NpbmdQYXJhbWV0ZXJFcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9yZGVyVG9QYXl0bSA9IHtcclxuICAgICAgICAgICAgTUlEOiB0aGlzLnBheXRtRm9ybURldGFpbHNbJ01JRCddLFxyXG4gICAgICAgICAgICBPUkRFUl9JRDogdGhpcy5wYXl0bUZvcm1EZXRhaWxzWydPUkRFUl9JRCddLFxyXG4gICAgICAgICAgICBDVVNUX0lEOiB0aGlzLnBheXRtRm9ybURldGFpbHNbJ0NVU1RfSUQnXSxcclxuICAgICAgICAgICAgSU5EVVNUUllfVFlQRV9JRDogdGhpcy5wYXl0bUZvcm1EZXRhaWxzWydJTkRVU1RSWV9UWVBFX0lEJ10sXHJcbiAgICAgICAgICAgIENIQU5ORUxfSUQ6IHRoaXMucGF5dG1Gb3JtRGV0YWlsc1snQ0hBTk5FTF9JRCddLFxyXG4gICAgICAgICAgICBUWE5fQU1PVU5UOiB0aGlzLnBheXRtRm9ybURldGFpbHNbJ1RYTl9BTU9VTlQnXSxcclxuICAgICAgICAgICAgV0VCU0lURTogdGhpcy5wYXl0bUZvcm1EZXRhaWxzWydXRUJTSVRFJ10sXHJcbiAgICAgICAgICAgIENBTExCQUNLX1VSTDogdGhpcy5wYXl0bUZvcm1EZXRhaWxzWydDQUxMQkFDS19VUkwnXSxcclxuICAgICAgICAgICAgQ0hFQ0tTVU1IQVNIOiB0aGlzLnBheXRtRm9ybURldGFpbHNbJ0NIRUNLU1VNSEFTSCddXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInNkYXNzZGFzXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnBheXRtLmNyZWF0ZU9yZGVyKHRoaXMub3JkZXJUb1BheXRtKTtcclxuICAgICAgICB0aGlzLnBheXRtLmluaXRpYWxpemUoXCJTVEFHSU5HXCIpO1xyXG4gICAgICAgIHRoaXMucGF5dG0uc3RhcnRQYXltZW50VHJhbnNhY3Rpb24oe1xyXG4gICAgICAgICAgICBzb21lVUlFcnJvck9jY3VycmVkOiBmdW5jdGlvbiAoaW5FcnJvck1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiMVwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGluRXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25UcmFuc2FjdGlvblJlc3BvbnNlOiBmdW5jdGlvbiAoaW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIyXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW5SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5ldHdvcmtOb3RBdmFpbGFibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiM1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV0d29yayBub3QgYXZhaWxhYmxlXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbGllbnRBdXRoZW50aWNhdGlvbkZhaWxlZDogZnVuY3Rpb24gKGluRXJyb3JNZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIjRcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbkVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRXJyb3JMb2FkaW5nV2ViUGFnZTogZnVuY3Rpb24gKFxyXG4gICAgICAgICAgICAgICAgaW5pRXJyb3JDb2RlLFxyXG4gICAgICAgICAgICAgICAgaW5FcnJvck1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBpbkZhaWxpbmdVcmxcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIjVcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbmlFcnJvckNvZGUsIGluRXJyb3JNZXNzYWdlLCBpbkZhaWxpbmdVcmwpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkJhY2tQcmVzc2VkQ2FuY2VsVHJhbnNhY3Rpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiNlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBjYW5jZWxsZWQgdHJhbnNhY3Rpb24gYnkgcHJlc3NpbmcgYmFjayBidXR0b25cIik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uVHJhbnNhY3Rpb25DYW5jZWw6IGZ1bmN0aW9uIChpbkVycm9yTWVzc2FnZSwgaW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI3XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW5FcnJvck1lc3NhZ2UsIGluUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=