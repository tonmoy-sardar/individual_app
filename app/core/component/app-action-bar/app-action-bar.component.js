"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var application_settings_1 = require("application-settings");
var store_app_service_1 = require("../../services/store-app.service");
var AppActionBarComponent = /** @class */ (function () {
    function AppActionBarComponent(_routerExtensions, storeAppService, routerExtensions) {
        this._routerExtensions = _routerExtensions;
        this.storeAppService = storeAppService;
        this.routerExtensions = routerExtensions;
        this.product_list = [];
    }
    AppActionBarComponent.prototype.ngOnInit = function () {
        if (application_settings_1.getBoolean('isLoggedin')) {
            this.isLoggedin = application_settings_1.getBoolean('isLoggedin');
            // alert(this.isLoggedin)
        }
        this.getAppDetails(this.appId);
    };
    AppActionBarComponent.prototype.getAppDetails = function (id) {
        var _this = this;
        this.storeAppService.getStoreAppDetails(id).subscribe(function (res) {
            _this.app_details = res;
            if (_this.app_details.is_product_service) {
                _this.serviceType = _this.app_details.is_product_service;
            }
            else {
                _this.serviceType = 1;
            }
            _this.app_details.app_product_categories.forEach(function (x) {
                x.products.forEach(function (y) {
                    _this.product_list.push(y);
                });
            });
            console.log(res);
            console.log(_this.product_list);
            _this.visible_key = true;
        }, function (error) {
            console.log(error);
        });
    };
    AppActionBarComponent.prototype.goBack = function () {
        this.routerExtensions.back();
    };
    AppActionBarComponent.prototype.logout = function () {
        application_settings_1.clear();
        this._routerExtensions.navigate(["/login"], { clearHistory: true });
    };
    __decorate([
        core_1.Input('appId'),
        __metadata("design:type", String)
    ], AppActionBarComponent.prototype, "appId", void 0);
    AppActionBarComponent = __decorate([
        core_1.Component({
            selector: "app-action-bar",
            moduleId: module.id,
            templateUrl: "./app-action-bar.component.html",
            styleUrls: ['./app-action-bar.component.css']
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            store_app_service_1.StoreAppService,
            router_1.RouterExtensions])
    ], AppActionBarComponent);
    return AppActionBarComponent;
}());
exports.AppActionBarComponent = AppActionBarComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWFjdGlvbi1iYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLWFjdGlvbi1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlEO0FBQ3pELHNEQUErRDtBQUMvRCw2REFBMkY7QUFDM0Ysc0VBQW1FO0FBUW5FO0lBT0ksK0JBQ1ksaUJBQW1DLEVBQ25DLGVBQWdDLEVBQ2hDLGdCQUFrQztRQUZsQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ25DLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBUjlDLGlCQUFZLEdBQVEsRUFBRSxDQUFDO0lBV3ZCLENBQUM7SUFFRCx3Q0FBUSxHQUFSO1FBQ0ksRUFBRSxDQUFBLENBQUMsaUNBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxpQ0FBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzNDLHlCQUF5QjtRQUM3QixDQUFDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELDZDQUFhLEdBQWIsVUFBYyxFQUFFO1FBQWhCLGlCQXVCQztRQXRCRyxJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FDakQsVUFBQSxHQUFHO1lBQ0MsS0FBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQztZQUMzRCxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsS0FBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUE7WUFDeEIsQ0FBQztZQUNELEtBQUksQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO29CQUNoQixLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDN0IsQ0FBQyxDQUFDLENBQUE7WUFDTixDQUFDLENBQUMsQ0FBQTtZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDOUIsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDNUIsQ0FBQyxFQUNELFVBQUEsS0FBSztZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdEIsQ0FBQyxDQUNKLENBQUE7SUFDTCxDQUFDO0lBQ0Qsc0NBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsc0NBQU0sR0FBTjtRQUNJLDRCQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFuRGU7UUFBZixZQUFLLENBQUMsT0FBTyxDQUFDOzt3REFBZTtJQUhyQixxQkFBcUI7UUFOakMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxpQ0FBaUM7WUFDOUMsU0FBUyxFQUFFLENBQUMsZ0NBQWdDLENBQUM7U0FDaEQsQ0FBQzt5Q0FTaUMseUJBQWdCO1lBQ2xCLG1DQUFlO1lBQ2QseUJBQWdCO09BVnJDLHFCQUFxQixDQXdEakM7SUFBRCw0QkFBQztDQUFBLEFBeERELElBd0RDO0FBeERZLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBnZXRTdHJpbmcsIHNldFN0cmluZywgZ2V0Qm9vbGVhbiwgc2V0Qm9vbGVhbiwgY2xlYXIgfSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgU3RvcmVBcHBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL3N0b3JlLWFwcC5zZXJ2aWNlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcImFwcC1hY3Rpb24tYmFyXCIsXHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9hcHAtYWN0aW9uLWJhci5jb21wb25lbnQuaHRtbFwiLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vYXBwLWFjdGlvbi1iYXIuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBBY3Rpb25CYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gICAgYXBwX2RldGFpbHM6IGFueTtcclxuICAgIHByb2R1Y3RfbGlzdDogYW55ID0gW107XHJcbiAgICBASW5wdXQoJ2FwcElkJykgYXBwSWQ6IHN0cmluZztcclxuICAgIHZpc2libGVfa2V5OiBib29sZWFuO1xyXG4gICAgaXNMb2dnZWRpbjogYm9vbGVhbjtcclxuICAgIHNlcnZpY2VUeXBlO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBfcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucyxcclxuICAgICAgICBwcml2YXRlIHN0b3JlQXBwU2VydmljZTogU3RvcmVBcHBTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9uc1xyXG4gICAgKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGlmKGdldEJvb2xlYW4oJ2lzTG9nZ2VkaW4nKSl7XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2dnZWRpbiA9IGdldEJvb2xlYW4oJ2lzTG9nZ2VkaW4nKTtcclxuICAgICAgICAgICAgLy8gYWxlcnQodGhpcy5pc0xvZ2dlZGluKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdldEFwcERldGFpbHModGhpcy5hcHBJZCk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIGdldEFwcERldGFpbHMoaWQpIHtcclxuICAgICAgICB0aGlzLnN0b3JlQXBwU2VydmljZS5nZXRTdG9yZUFwcERldGFpbHMoaWQpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwX2RldGFpbHMgPSByZXM7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hcHBfZGV0YWlscy5pc19wcm9kdWN0X3NlcnZpY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2VUeXBlID0gdGhpcy5hcHBfZGV0YWlscy5pc19wcm9kdWN0X3NlcnZpY2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2VUeXBlID0gMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBfZGV0YWlscy5hcHBfcHJvZHVjdF9jYXRlZ29yaWVzLmZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeC5wcm9kdWN0cy5mb3JFYWNoKHkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2R1Y3RfbGlzdC5wdXNoKHkpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnByb2R1Y3RfbGlzdClcclxuICAgICAgICAgICAgICAgIHRoaXMudmlzaWJsZV9rZXkgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxuICAgIGdvQmFjaygpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMuYmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpe1xyXG4gICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5fcm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCIvbG9naW5cIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgfVxyXG5cclxufSJdfQ==