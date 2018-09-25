import { Injectable, EventEmitter, Output } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as Globals from '../../core/globals';

@Injectable()
export class StoreAppService {

  constructor(private http: HttpClient) { }

  @Output() getCartStatus: EventEmitter<any> = new EventEmitter();
  @Output() getPageStatus: EventEmitter<any> = new EventEmitter();

  cartStatus(data) {
    if (data == true) {
      this.getCartStatus.emit(true);
      return
    } else {
      this.getCartStatus.emit(false);
      return
    }
  }

  pageStatus(data) {
    if (data == true) {
      this.getPageStatus.emit(true);
      return
    } else {
      this.getPageStatus.emit(false);
      return
    }
  }

  getStoreAppDetails(id) {
    return this.http.get(Globals.apiEndpoint + 'app_all_details/' + id + '/')
  }

  getStoreAppMinDetails(id) {
    return this.http.get(Globals.apiEndpoint + 'app_min_details/' + id + '/')
  }

  getStoreAppAdoutDetails(id) {
    return this.http.get(Globals.apiEndpoint + 'app_about_details/' + id + '/')
  }

  getStoreAppProductDetails(id, params) {
    return this.http.get(Globals.apiEndpoint + 'app_product_details/' + id + '/' + params)
  }


  getStoreAppContactDetails(id) {
    return this.http.get(Globals.apiEndpoint + 'app_contact_details/' + id + '/')
  }



  createOrder(data) {
    return this.http.post(Globals.apiEndpoint + 'create_orders/', data)
  }

  createChatSessionView(param, data) {
    return this.http.post(Globals.apiEndpoint + 'messages/' + param, data)
  }

  getChatMembersDetails(param) {
    return this.http.get(Globals.apiEndpoint + 'chat_members/' + param)
  }

  getMessageListByApp(thread) {
    return this.http.get(Globals.apiEndpoint + 'messages/' + thread + "/")
  }

  viewMessages(param) {
    return this.http.get(Globals.apiEndpoint + 'chat_read_message/' + param)
  }

  getAppRating(customer, app_master) {
    return this.http.get(Globals.apiEndpoint + 'search_rating/?customer=' + customer + '&app_master=' + app_master)
  }

  appRate(data) {
    return this.http.post(Globals.apiEndpoint + 'add_rating/', data)
  }

  paytmFormValue(order_amount, table_order_id, app_id): Observable<any> {
    return this.http.get(Globals.apiEndpoint + 'get_payment_details/?order_amount=' + order_amount + '&table_order_id=' + table_order_id + '&type=app&paytm_marchent_flag=1&app_id=' + app_id)
  }

  getCustomerAddress(customer) {
    return this.http.get(Globals.apiEndpoint + 'customer_address/' + customer + '/')
  }

  addCustomerAddress(data) {
    return this.http.post(Globals.apiEndpoint + 'customer_address/', data)
  }

  getStateList() {
    return this.http.get(Globals.apiEndpoint + 'states_dropdown/')
  }

  getCustomerDetails(id) {
    return this.http.get(Globals.apiEndpoint + 'customer_details/' + id + '/')
  }

  getCustomerOrderListByApp(params) {
    return this.http.get(Globals.apiEndpoint + 'order_details_by_customer_app/' + params)
  }

  getSocialMediaListByApp(id) {
    return this.http.get(Globals.apiEndpoint + 'app_social_media/' + id + '/')
  }

  getOrderDetails(id) {
    return this.http.get(Globals.apiEndpoint + 'order_details/' + id + '/')
  }

  getChatUnreadMessageCount(user_id, app_id) {
    return this.http.get(Globals.apiEndpoint + 'chat_unread_message_count/?user=' + user_id + '&user_type=customer&app_id=' + app_id)
  }

  updateOrder(id, data) {
    return this.http.put(Globals.apiEndpoint + 'order_payment/' + id + '/', data)
  }

}


export class OrderModule {
  customer: string;
  price: number;
  appmaster: string;
  address: number;
  payment_type: number;
  order_details: OrderDetails[]
}

export class OrderDetails {
  quantity: number;
  unit_price: string;
  IGST: string;
  CGST: string;
  packaging_cost: string;
  uom: string;
  appmaster: number;
  product: number
}

export class RadioOption {
  text: string;
  id: number;
  selected: boolean = false;

  constructor(text: string, id: number) {
    this.text = text;
    this.id = id;
  }
}

export class CustomRadioOption {
  name: string;
  text: string;
  id: number;
  selected: boolean = false;

  constructor(name: string, text: string, id: number) {
    this.name = name;
    this.text = text;
    this.id = id;
  }
}
