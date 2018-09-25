import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { SecureStorage } from "nativescript-secure-storage";
import { getString, setString, getBoolean, setBoolean, clear } from "application-settings";
import { StoreAppService, OrderModule, OrderDetails, RadioOption, CustomRadioOption } from "../../../core/services/store-app.service";
import { RouterExtensions } from "nativescript-angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedIndexChangedEventData, ValueList } from "nativescript-drop-down";
import { LoadingIndicator } from "nativescript-loading-indicator";
import {
    Paytm,
    Order,
    TransactionCallback,
    IOSCallback
} from "@nstudio/nativescript-paytm";
import * as dialogs from "ui/dialogs";
import * as Globals from '../../../core/globals';
import { NotificationService } from "../../../core/services/notification.service";

@Component({
    selector: 'payment',
    moduleId: module.id,
    templateUrl: `payment.component.html`,
    styleUrls: [`payment.component.css`]
})
export class StoreAppPaymentComponent implements OnInit {
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
    paytmFormDetails: any;
    paytm: Paytm;
    orderToPaytm: Order = {
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

    addressOptions?: Array<CustomRadioOption>;
    customer_adress_list: any = [];
    state_list: ValueList<string>;
    form: FormGroup;
    address_box_key: boolean;
    loader = new LoadingIndicator();
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
    address_id: number;
    payment_type: number;
    paymentOptions: Array<RadioOption>;
    is_paytm_enabled: boolean;
    currency: string;
    app_details: any;
    app_device_token: string;
    customer_details: any;
    user_info: string;
    order_id: number;
    customer_email: string;
    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private storeAppService: StoreAppService,
        private router: RouterExtensions,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private ngZone: NgZone
    ) {
        this.secureStorage = new SecureStorage();
        this.order = new OrderModule();
    }

    ngOnInit() {
        this.storeAppService.pageStatus(false);
        this.loader.show(this.lodaing_options);
        this.currency = Globals.currency
        var full_location = this.location.path().split('/');
        this.app_id = full_location[2].trim();
        this.user_id = getString('user_id');
        if (getString('email') != undefined) {
            this.customer_email = getString('email')
        }
        else {
            this.customer_email = "customer@" + getString('contact_no')
        }
        this.populateData();
        this.paytm = new Paytm();
        this.getCustomerAdressList(this.user_id);
        this.getStateList();
        this.form = this.formBuilder.group({
            address_name: ['', Validators.required],
            address: ['', Validators.required],
            state: ['', Validators.required],
            pincode: ['',
                [Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6)]
            ],
            customer: [this.user_id, Validators.required]
        });

        this.getAppDetails(this.app_id)
        this.getCustomerDetails(this.user_id)
    }

    getAppDetails(id) {

        this.storeAppService.getStoreAppDetails(id).subscribe(
            res => {
                this.getAppDeviceToken(res['user'].id);
                if (res['is_paytm_enabled'] == 1) {
                    this.is_paytm_enabled = true;
                    this.paymentOptions = [
                        new RadioOption("Paytm", 0),
                        new RadioOption("Cash On Delivery", 1)
                    ]
                }
                else {
                    this.is_paytm_enabled = false;
                    this.paymentOptions = [
                        new RadioOption("Cash On Delivery", 1)
                    ]
                }
                this.paymentOptions[0]['selected'] = true;
                this.payment_type = this.paymentOptions[0]['id'];
                this.loader.hide()
            },
            error => {
                this.loader.hide()
                // console.log(error)
            }
        )
    }

    getAppDeviceToken(id) {
        this.notificationService.getAppDeviceToken(id).subscribe(
            res => {
                // console.log(res)
                this.app_device_token = res['device_token'];
            },
            error => {
                // console.log(error)
            }
        )
    }

    getCustomerDetails(id) {
        this.storeAppService.getCustomerDetails(id).subscribe(
            res => {
                // console.log(res)
                this.customer_details = res;
                this.user_info = this.customer_details.customer_name + ',' + this.customer_details.contact_no;
            },
            error => {
                // console.log(error)
            }
        )
    }

    pushNotf() {
        var value = {
            title: "BanaoApp(new order)",
            subtitle: "New order",
            text: "New order is placed from " + this.user_info
        }
        this.notificationService.sendPushNotification(this.app_device_token, value).subscribe(
            res => {
                // console.log(res)
            },
            error => {
                // console.log(error)
            }
        )
        this.ngZone.run(() => {
            this.loader.hide();
            this.router.navigate(['/store-app/', this.app_id, 'payment-success', this.order_id])
        })

    }

    changeCheckedRadioPaymentMode(radioOption: RadioOption): void {
        radioOption.selected = !radioOption.selected;
        this.payment_type = radioOption.id
        if (!radioOption.selected) {
            return;
        }

        // uncheck all other options
        this.paymentOptions.forEach(option => {
            if (option.text !== radioOption.text) {
                option.selected = false;
            }
        });
    }

    changeCheckedRadioAddress(radioOption: CustomRadioOption): void {
        if (this.addressOptions.length > 1) {
            radioOption.selected = !radioOption.selected;
            this.address_id = radioOption.id
            if (!radioOption.selected) {
                return;
            }

            // uncheck all other options
            this.addressOptions.forEach(option => {
                if (option.id !== radioOption.id) {
                    option.selected = false;
                }
            });
        }

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
                }
            }
        );
    }

    getCustomerAdressList(id) {
        this.storeAppService.getCustomerAddress(id).subscribe(
            (res: any[]) => {
                // console.log(res);
                this.customer_adress_list = res;
                this.addressOptions = [];

                this.customer_adress_list.forEach(x => {
                    var d = new CustomRadioOption(x.address_name, x.address, x.id)
                    this.addressOptions.push(d)
                })
                this.addressOptions[0]['selected'] = true;
                this.address_id = this.addressOptions[0]['id']
            },
            error => {
                // console.log(error)
            }
        )
    }

    getStateList() {
        this.storeAppService.getStateList().subscribe(
            (res: any[]) => {
                // console.log(res);
                this.state_list = new ValueList<string>();
                for (let i = 0; i < res.length; i++) {
                    this.state_list.push({
                        value: res[i]['id'],
                        display: res[i]['state_name'],
                    });
                }
            },
            error => {
                // console.log(error)
            }
        )
    }

    getDiscount(price, discounted_price) {
        return Math.floor(((price - discounted_price) * 100) / price) + '%';
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



    setCartData() {
        this.secureStorage.set({
            key: 'cart',
            value: JSON.stringify(this.all_cart_data)
        }).then(success => {
            this.storeAppService.cartStatus(true);
            this.getTotalItemPrice();
            this.getTotalPackingPrice();
        });
    }

    onchange(args: SelectedIndexChangedEventData) {
        this.form.patchValue({
            state: this.state_list.getValue(args.newIndex)
        })
    }

    addAdressBox() {
        this.address_box_key = true;
    }

    addAdress() {
        if (this.form.valid) {
            this.loader.show(this.lodaing_options);
            this.storeAppService.addCustomerAddress(this.form.value).subscribe(
                res => {
                    this.loader.hide();
                    // console.log(res)
                    this.address_box_key = false;
                    this.getCustomerAdressList(this.user_id);
                },
                error => {
                    // console.log(error)
                }
            )

        }
        else {
            this.markFormGroupTouched(this.form)
        }
    }

    cancel() {
        this.address_box_key = false;
    }

    isFieldValid(field: string) {
        return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
    }

    displayFieldCss(field: string) {
        return {
            'is-invalid': this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched),
            'is-valid': this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched)
        };
    }

    markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control.controls) {
                control.controls.forEach(c => this.markFormGroupTouched(c));
            }
        });
    }


    orderPay() {
        if (this.address_id == undefined) {
            dialogs.alert("Please Select Shipping Address").then(() => {
                // console.log("Dialog closed!");
            });
        }
        else {
            this.loader.show(this.lodaing_options);
            this.order.customer = this.user_id;
            this.order.price = this.total_item_price + this.total_packing_price;
            this.order.address = this.address_id;
            this.order.appmaster = this.app_id
            this.order.payment_type = this.payment_type;
            var all_details_data = [];
            this.customer_cart_data.forEach(x => {
                var details_data = new OrderDetails();
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
                var index = this.all_cart_data.findIndex(y => y.customer_id == this.user_id && y.app_id == this.app_id && y.product_id == x.product_id);
                if (index != -1) {
                    this.all_cart_data.splice(index, 1);
                }
            })
            this.order.order_details = all_details_data;

            if (this.order_id == undefined) {
                this.storeAppService.createOrder(this.order).subscribe(
                    res => {
                        // console.log(res)
                        this.order_id = res['id']
                        if (this.payment_type == 1) {
                            this.pushNotf();
                        }
                        else {
                            this.getPaytmFormValue(this.order.price, this.order_id)
                        }
                        this.setCartData();
                    },
                    error => {
                        // console.log(error)
                    }
                )
            }
            else {
                this.getPaytmFormValue(this.order.price, this.order_id)
            }


        }


    }

    getPaytmFormValue(amount: number, table_order_id: number) {
        this.storeAppService.paytmFormValue(amount, table_order_id, this.app_id, this.customer_email).subscribe(
            res => {
                // console.log(res)
                this.paytmFormDetails = res;
                this.loader.hide();
                this.payViaPaytm();
            },
            error => {
                // console.log(error)
            }
        )
    }

    // paytm
    payViaPaytm() {
        var $this = this;
        this.paytm.setIOSCallbacks({
            didFinishedResponse: function (response) {
                // console.log(response);
            },
            didCancelTransaction: function () {
                // console.log("User cancelled transaction");
            },
            errorMissingParameterError: function (error) {
                // console.log(error);
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

        this.paytm.createOrder(this.orderToPaytm);
        this.paytm.initialize("STAGING");
        this.paytm.startPaymentTransaction({
            someUIErrorOccurred: function (inErrorMessage) {
                // console.log(inErrorMessage);
            },
            onTransactionResponse: function (inResponse) {
                var response = JSON.parse(inResponse);
                // console.log(response);
                var ORDERID = response['ORDERID'];
                var txn_id = response['TXNID'];
                var txn_status;
                if (response['STATUS'] == 'TXN_SUCCESS') {
                    txn_status = 2;
                }
                else if (response['STATUS'] == 'PROCESSING') {
                    txn_status = 1;
                }
                else if (response['STATUS'] == 'TXN_FAILURE') {
                    txn_status = 0;
                }
                else if (response['STATUS'] == 'PENDING') {
                    txn_status = 3;
                }
                var data = {
                    txn_status: txn_status,
                    txn_id: txn_id,
                    bank_txn_id: response['BANKTXNID'],
                    checksumhash: response['CHECKSUMHASH'],
                    paytm_response: inResponse
                }
                // console.log(inResponse)
                $this.updateOrder(ORDERID, data)
            },
            networkNotAvailable: function () {

                // console.log("Network not available");
            },
            clientAuthenticationFailed: function (inErrorMessage) {

                // console.log(inErrorMessage);
            },
            onErrorLoadingWebPage: function (
                iniErrorCode,
                inErrorMessage,
                inFailingUrl
            ) {

                // console.log(iniErrorCode, inErrorMessage, inFailingUrl);
            },
            onBackPressedCancelTransaction: function () {

                // console.log("User cancelled transaction by pressing back button");
            },
            onTransactionCancel: function (inErrorMessage, inResponse) {

                // console.log(inErrorMessage, inResponse);
            }
        });
    }

    updateOrder(id, data) {
        // console.log(data)
        this.loader.show(this.lodaing_options);
        this.storeAppService.updateOrder(id, data).subscribe(
            res => {
                // console.log(res)
                if (data.txn_status == 2) {
                    this.pushNotf()
                }
                else {
                    this.loader.hide();
                    this.router.navigate(['/store-app/', this.app_id, 'payment-success', this.order_id])
                }

            },
            error => {
                this.loader.hide();
                // console.log(error)
            }
        )
    }
}