"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var store_app_service_1 = require("../../services/store-app.service");
var AppMenuBarComponent = /** @class */ (function () {
    function AppMenuBarComponent(route, storeAppService) {
        this.route = route;
        this.storeAppService = storeAppService;
        this.product_list = [];
    }
    AppMenuBarComponent.prototype.ngOnInit = function () {
        this.getAppDetails(this.appId);
    };
    AppMenuBarComponent.prototype.getAppDetails = function (id) {
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
    __decorate([
        core_1.Input('appId'),
        __metadata("design:type", String)
    ], AppMenuBarComponent.prototype, "appId", void 0);
    AppMenuBarComponent = __decorate([
        core_1.Component({
            selector: 'app-menu-bar',
            moduleId: module.id,
            templateUrl: "app-menu-bar.component.html",
            styleUrls: ["app-menu-bar.component.css"]
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            store_app_service_1.StoreAppService])
    ], AppMenuBarComponent);
    return AppMenuBarComponent;
}());
exports.AppMenuBarComponent = AppMenuBarComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLW1lbnUtYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC1tZW51LWJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsMENBQWlEO0FBQ2pELHNFQUFtRTtBQU9uRTtJQU1JLDZCQUNZLEtBQXFCLEVBQ3JCLGVBQWdDO1FBRGhDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQU41QyxpQkFBWSxHQUFRLEVBQUUsQ0FBQztJQVN2QixDQUFDO0lBRUQsc0NBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCwyQ0FBYSxHQUFiLFVBQWMsRUFBRTtRQUFoQixpQkF1QkM7UUF0QkcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQ2pELFVBQUEsR0FBRztZQUNDLEtBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxLQUFJLENBQUMsV0FBVyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUM7WUFDM0QsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNGLEtBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1lBQ3hCLENBQUM7WUFDRCxLQUFJLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7Z0JBQzdDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztvQkFDaEIsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzdCLENBQUMsQ0FBQyxDQUFBO1lBQ04sQ0FBQyxDQUFDLENBQUE7WUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQzlCLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQzVCLENBQUMsRUFDRCxVQUFBLEtBQUs7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3RCLENBQUMsQ0FDSixDQUFBO0lBQ0wsQ0FBQztJQXJDZTtRQUFmLFlBQUssQ0FBQyxPQUFPLENBQUM7O3NEQUFlO0lBSHJCLG1CQUFtQjtRQU4vQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLGNBQWM7WUFDeEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSw2QkFBNkI7WUFDMUMsU0FBUyxFQUFFLENBQUMsNEJBQTRCLENBQUM7U0FDNUMsQ0FBQzt5Q0FRcUIsdUJBQWM7WUFDSixtQ0FBZTtPQVJuQyxtQkFBbUIsQ0F5Qy9CO0lBQUQsMEJBQUM7Q0FBQSxBQXpDRCxJQXlDQztBQXpDWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IFN0b3JlQXBwU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9zdG9yZS1hcHAuc2VydmljZVwiO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYXBwLW1lbnUtYmFyJyxcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogYGFwcC1tZW51LWJhci5jb21wb25lbnQuaHRtbGAsXHJcbiAgICBzdHlsZVVybHM6IFtgYXBwLW1lbnUtYmFyLmNvbXBvbmVudC5jc3NgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwTWVudUJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgICBhcHBfZGV0YWlsczogYW55O1xyXG4gICAgcHJvZHVjdF9saXN0OiBhbnkgPSBbXTtcclxuICAgIEBJbnB1dCgnYXBwSWQnKSBhcHBJZDogc3RyaW5nO1xyXG4gICAgdmlzaWJsZV9rZXk6IGJvb2xlYW47XHJcbiAgICBzZXJ2aWNlVHlwZTtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxyXG4gICAgICAgIHByaXZhdGUgc3RvcmVBcHBTZXJ2aWNlOiBTdG9yZUFwcFNlcnZpY2VcclxuICAgICkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLmdldEFwcERldGFpbHModGhpcy5hcHBJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXBwRGV0YWlscyhpZCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmVBcHBTZXJ2aWNlLmdldFN0b3JlQXBwRGV0YWlscyhpZCkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBfZGV0YWlscyA9IHJlcztcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFwcF9kZXRhaWxzLmlzX3Byb2R1Y3Rfc2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmljZVR5cGUgPSB0aGlzLmFwcF9kZXRhaWxzLmlzX3Byb2R1Y3Rfc2VydmljZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmljZVR5cGUgPSAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcF9kZXRhaWxzLmFwcF9wcm9kdWN0X2NhdGVnb3JpZXMuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB4LnByb2R1Y3RzLmZvckVhY2goeSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZHVjdF9saXN0LnB1c2goeSlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvZHVjdF9saXN0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy52aXNpYmxlX2tleSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59Il19