"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var Globals = require("../../core/globals");
var StoreAppService = /** @class */ (function () {
    function StoreAppService(http) {
        this.http = http;
    }
    StoreAppService.prototype.getStoreAppDetails = function (id) {
        return this.http.get(Globals.apiEndpoint + 'app_all_details/' + id + '/');
    };
    StoreAppService.prototype.createOrder = function (data) {
        return this.http.post(Globals.apiEndpoint + 'create_orders/', data);
    };
    StoreAppService.prototype.createChatSessionView = function (param, data) {
        return this.http.post(Globals.apiEndpoint + 'messages/' + param, data);
    };
    StoreAppService.prototype.getMessageListByApp = function (thread) {
        return this.http.get(Globals.apiEndpoint + 'messages/' + thread + "/");
    };
    StoreAppService.prototype.getAppRating = function (customer, app_master) {
        return this.http.get(Globals.apiEndpoint + 'search_rating/?customer=' + customer + '&app_master=' + app_master);
    };
    StoreAppService.prototype.appRate = function (data) {
        return this.http.post(Globals.apiEndpoint + 'add_rating/', data);
    };
    StoreAppService.prototype.paytmFormValue = function (order_amount) {
        return this.http.get(Globals.apiEndpoint + 'get_payment_details/?order_amount=' + order_amount + '&type=app');
    };
    StoreAppService.prototype.getCustomerAddress = function (customer) {
        return this.http.get(Globals.apiEndpoint + 'customer_address/' + customer + '/');
    };
    StoreAppService.prototype.addCustomerAddress = function (data) {
        return this.http.post(Globals.apiEndpoint + 'customer_address/', data);
    };
    StoreAppService.prototype.getStateList = function () {
        return this.http.get(Globals.apiEndpoint + 'states_dropdown/');
    };
    StoreAppService.prototype.getCustomerDetails = function (id) {
        return this.http.get(Globals.apiEndpoint + 'customer_details/' + id + '/');
    };
    StoreAppService.prototype.getCustomerOrderListByApp = function (params) {
        return this.http.get(Globals.apiEndpoint + 'order_details_by_customer_app/' + params);
    };
    StoreAppService.prototype.getSocialMediaListByApp = function (id) {
        return this.http.get(Globals.apiEndpoint + 'app_social_media/' + id);
    };
    StoreAppService.prototype.getOrderDetails = function (id) {
        return this.http.get(Globals.apiEndpoint + 'all_order_details/' + id);
    };
    StoreAppService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], StoreAppService);
    return StoreAppService;
}());
exports.StoreAppService = StoreAppService;
var OrderModule = /** @class */ (function () {
    function OrderModule() {
    }
    return OrderModule;
}());
exports.OrderModule = OrderModule;
var OrderDetails = /** @class */ (function () {
    function OrderDetails() {
    }
    return OrderDetails;
}());
exports.OrderDetails = OrderDetails;
var RadioOption = /** @class */ (function () {
    function RadioOption(text, id) {
        this.selected = false;
        this.text = text;
        this.id = id;
    }
    return RadioOption;
}());
exports.RadioOption = RadioOption;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUtYXBwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdG9yZS1hcHAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyw2Q0FLOEI7QUFHOUIsNENBQThDO0FBRzlDO0lBRUUseUJBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDO0lBRXpDLDRDQUFrQixHQUFsQixVQUFtQixFQUFFO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLGtCQUFrQixHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQTtJQUMzRSxDQUFDO0lBRUQscUNBQVcsR0FBWCxVQUFZLElBQUk7UUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNyRSxDQUFDO0lBRUQsK0NBQXFCLEdBQXJCLFVBQXNCLEtBQUssRUFBRSxJQUFJO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLFdBQVcsR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDeEUsQ0FBQztJQUVELDZDQUFtQixHQUFuQixVQUFvQixNQUFNO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLFdBQVcsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUE7SUFDeEUsQ0FBQztJQUVELHNDQUFZLEdBQVosVUFBYSxRQUFRLEVBQUUsVUFBVTtRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRywwQkFBMEIsR0FBRyxRQUFRLEdBQUcsY0FBYyxHQUFHLFVBQVUsQ0FBQyxDQUFBO0lBQ2pILENBQUM7SUFFRCxpQ0FBTyxHQUFQLFVBQVEsSUFBSTtRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNsRSxDQUFDO0lBRUQsd0NBQWMsR0FBZCxVQUFlLFlBQVk7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsb0NBQW9DLEdBQUcsWUFBWSxHQUFHLFdBQVcsQ0FBQyxDQUFBO0lBQy9HLENBQUM7SUFFRCw0Q0FBa0IsR0FBbEIsVUFBbUIsUUFBUTtRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxtQkFBbUIsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUE7SUFDbEYsQ0FBQztJQUVELDRDQUFrQixHQUFsQixVQUFtQixJQUFJO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ3hFLENBQUM7SUFFRCxzQ0FBWSxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsa0JBQWtCLENBQUMsQ0FBQTtJQUNoRSxDQUFDO0lBRUQsNENBQWtCLEdBQWxCLFVBQW1CLEVBQUU7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFBO0lBQzVFLENBQUM7SUFFRCxtREFBeUIsR0FBekIsVUFBMEIsTUFBTTtRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxnQ0FBZ0MsR0FBRyxNQUFNLENBQUUsQ0FBQTtJQUN4RixDQUFDO0lBRUQsaURBQXVCLEdBQXZCLFVBQXdCLEVBQUU7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLEdBQUcsRUFBRSxDQUFFLENBQUE7SUFDdkUsQ0FBQztJQUVELHlDQUFlLEdBQWYsVUFBZ0IsRUFBRTtRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxvQkFBb0IsR0FBRyxFQUFFLENBQUUsQ0FBQTtJQUN4RSxDQUFDO0lBMURVLGVBQWU7UUFEM0IsaUJBQVUsRUFBRTt5Q0FHZSxpQkFBVTtPQUZ6QixlQUFlLENBNEQzQjtJQUFELHNCQUFDO0NBQUEsQUE1REQsSUE0REM7QUE1RFksMENBQWU7QUErRDVCO0lBQUE7SUFPQSxDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQVBZLGtDQUFXO0FBU3hCO0lBQUE7SUFTQSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBVEQsSUFTQztBQVRZLG9DQUFZO0FBV3pCO0lBS0UscUJBQVksSUFBWSxFQUFFLEVBQVU7UUFGcEMsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUd4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFURCxJQVNDO0FBVFksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHtcclxuICBIdHRwQ2xpZW50LFxyXG4gIEh0dHBIZWFkZXJzLFxyXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxyXG4gIEh0dHBQYXJhbXMsXHJcbn0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9odHRwXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCwgdGhyb3dFcnJvciB9IGZyb20gXCJyeGpzXCI7XHJcbmltcG9ydCB7IG1hcCwgY2F0Y2hFcnJvciB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xyXG5pbXBvcnQgKiBhcyBHbG9iYWxzIGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFscyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTdG9yZUFwcFNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxyXG5cclxuICBnZXRTdG9yZUFwcERldGFpbHMoaWQpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KEdsb2JhbHMuYXBpRW5kcG9pbnQgKyAnYXBwX2FsbF9kZXRhaWxzLycgKyBpZCArICcvJylcclxuICB9XHJcblxyXG4gIGNyZWF0ZU9yZGVyKGRhdGEpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChHbG9iYWxzLmFwaUVuZHBvaW50ICsgJ2NyZWF0ZV9vcmRlcnMvJywgZGF0YSlcclxuICB9XHJcblxyXG4gIGNyZWF0ZUNoYXRTZXNzaW9uVmlldyhwYXJhbSwgZGF0YSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KEdsb2JhbHMuYXBpRW5kcG9pbnQgKyAnbWVzc2FnZXMvJyArIHBhcmFtLCBkYXRhKVxyXG4gIH1cclxuXHJcbiAgZ2V0TWVzc2FnZUxpc3RCeUFwcCh0aHJlYWQpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KEdsb2JhbHMuYXBpRW5kcG9pbnQgKyAnbWVzc2FnZXMvJyArIHRocmVhZCArIFwiL1wiKVxyXG4gIH1cclxuXHJcbiAgZ2V0QXBwUmF0aW5nKGN1c3RvbWVyLCBhcHBfbWFzdGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChHbG9iYWxzLmFwaUVuZHBvaW50ICsgJ3NlYXJjaF9yYXRpbmcvP2N1c3RvbWVyPScgKyBjdXN0b21lciArICcmYXBwX21hc3Rlcj0nICsgYXBwX21hc3RlcilcclxuICB9XHJcblxyXG4gIGFwcFJhdGUoZGF0YSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KEdsb2JhbHMuYXBpRW5kcG9pbnQgKyAnYWRkX3JhdGluZy8nLCBkYXRhKVxyXG4gIH1cclxuXHJcbiAgcGF5dG1Gb3JtVmFsdWUob3JkZXJfYW1vdW50KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KEdsb2JhbHMuYXBpRW5kcG9pbnQgKyAnZ2V0X3BheW1lbnRfZGV0YWlscy8/b3JkZXJfYW1vdW50PScgKyBvcmRlcl9hbW91bnQgKyAnJnR5cGU9YXBwJylcclxuICB9XHJcblxyXG4gIGdldEN1c3RvbWVyQWRkcmVzcyhjdXN0b21lcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoR2xvYmFscy5hcGlFbmRwb2ludCArICdjdXN0b21lcl9hZGRyZXNzLycgKyBjdXN0b21lciArICcvJylcclxuICB9XHJcblxyXG4gIGFkZEN1c3RvbWVyQWRkcmVzcyhkYXRhKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoR2xvYmFscy5hcGlFbmRwb2ludCArICdjdXN0b21lcl9hZGRyZXNzLycsIGRhdGEpXHJcbiAgfVxyXG5cclxuICBnZXRTdGF0ZUxpc3QoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChHbG9iYWxzLmFwaUVuZHBvaW50ICsgJ3N0YXRlc19kcm9wZG93bi8nKVxyXG4gIH1cclxuXHJcbiAgZ2V0Q3VzdG9tZXJEZXRhaWxzKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChHbG9iYWxzLmFwaUVuZHBvaW50ICsgJ2N1c3RvbWVyX2RldGFpbHMvJyArIGlkICsgJy8nKVxyXG4gIH1cclxuXHJcbiAgZ2V0Q3VzdG9tZXJPcmRlckxpc3RCeUFwcChwYXJhbXMpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KEdsb2JhbHMuYXBpRW5kcG9pbnQgKyAnb3JkZXJfZGV0YWlsc19ieV9jdXN0b21lcl9hcHAvJyArIHBhcmFtcyApXHJcbiAgfVxyXG5cclxuICBnZXRTb2NpYWxNZWRpYUxpc3RCeUFwcChpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoR2xvYmFscy5hcGlFbmRwb2ludCArICdhcHBfc29jaWFsX21lZGlhLycgKyBpZCApXHJcbiAgfVxyXG5cclxuICBnZXRPcmRlckRldGFpbHMoaWQpe1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoR2xvYmFscy5hcGlFbmRwb2ludCArICdhbGxfb3JkZXJfZGV0YWlscy8nICsgaWQgKVxyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgT3JkZXJNb2R1bGUge1xyXG4gIGN1c3RvbWVyOiBzdHJpbmc7XHJcbiAgcHJpY2U6IG51bWJlcjtcclxuICBhcHBtYXN0ZXI6IHN0cmluZztcclxuICBhZGRyZXNzOiBudW1iZXI7XHJcbiAgcGF5bWVudF90eXBlOiBudW1iZXI7XHJcbiAgb3JkZXJfZGV0YWlsczogT3JkZXJEZXRhaWxzW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE9yZGVyRGV0YWlscyB7XHJcbiAgcXVhbnRpdHk6IG51bWJlcjtcclxuICB1bml0X3ByaWNlOiBzdHJpbmc7XHJcbiAgSUdTVDogc3RyaW5nO1xyXG4gIENHU1Q6IHN0cmluZztcclxuICBwYWNrYWdpbmdfY29zdDogc3RyaW5nO1xyXG4gIHVvbTogc3RyaW5nO1xyXG4gIGFwcG1hc3RlcjogbnVtYmVyO1xyXG4gIHByb2R1Y3Q6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmFkaW9PcHRpb24ge1xyXG4gIHRleHQ6IHN0cmluZztcclxuICBpZDogbnVtYmVyO1xyXG4gIHNlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZywgaWQ6IG51bWJlcikge1xyXG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICB9XHJcbn1cclxuIl19