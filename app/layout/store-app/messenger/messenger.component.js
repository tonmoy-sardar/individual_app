"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var store_app_service_1 = require("../../../core/services/store-app.service");
var router_2 = require("nativescript-angular/router");
var application_settings_1 = require("application-settings");
require("nativescript-websockets");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
var StoreAppMessengerComponent = /** @class */ (function () {
    function StoreAppMessengerComponent(route, location, storeAppService, router, zone) {
        this.route = route;
        this.location = location;
        this.storeAppService = storeAppService;
        this.router = router;
        this.zone = zone;
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
        this.messages = [];
        this.message = "";
    }
    StoreAppMessengerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var full_location = this.location.path().split('/');
        this.app_id = full_location[2].trim();
        this.user_id = application_settings_1.getString('user_id');
        this.createChatSession();
        this.socket = new WebSocket("ws://132.148.147.239:8001/messages/?sender=" + this.user_id + "&sender_type=customer&receiver=" + this.app_id + "&receiver_type=app_master");
        this.socket.onopen = function (evt) { return _this.onOpen(evt); };
        this.socket.onclose = function (evt) { return _this.onClose(evt); };
        this.socket.onmessage = function (evt) { return _this.onMessage(evt); };
        this.socket.onerror = function (evt) { return _this.onError(evt); };
    };
    StoreAppMessengerComponent.prototype.onOpen = function (evt) {
        console.log(evt);
        // this.zone.run(() => {
        //     var data = {
        //         text: "Welcome to the chat!",
        //         created: new Date(),
        //         sender: false
        //     }
        //     this.messages.push(data);
        // });
        console.log("Welcome to the chat!");
    };
    StoreAppMessengerComponent.prototype.onClose = function (evt) {
        // this.zone.run(() => {
        //     var data = {
        //         text: "You have been disconnected",
        //         created: new Date(),
        //         sender: false
        //     }
        //     this.messages.push(data);
        // });
        console.log("You have been disconnected");
    };
    StoreAppMessengerComponent.prototype.onMessage = function (evt) {
        var _this = this;
        console.log(JSON.parse(evt.data));
        var msgData = JSON.parse(evt.data);
        this.zone.run(function () {
            var data = {
                text: msgData.message,
                created: new Date()
            };
            if (msgData.chat_user == _this.user_id) {
                data['sender'] = true;
            }
            else {
                data['sender'] = false;
            }
            _this.messages.push(data);
            _this.scrollToBottom();
        });
    };
    StoreAppMessengerComponent.prototype.onError = function (evt) {
        console.log("The socket had an error");
    };
    StoreAppMessengerComponent.prototype.ngOnDestroy = function () {
        // this.socket.close();
    };
    StoreAppMessengerComponent.prototype.isViewed = function (message) {
        return false;
    };
    StoreAppMessengerComponent.prototype.send = function () {
        if (this.message) {
            var data = {
                chat_user: this.user_id,
                chat_user_type: "customer",
                message: this.message
            };
            this.socket.send(JSON.stringify(data));
            this.message = "";
        }
    };
    StoreAppMessengerComponent.prototype.createChatSession = function () {
        var _this = this;
        var data = {
            chat_user: '',
            message: '',
            chat_user_type: ''
        };
        var param = "?sender=" + this.user_id + "&sender_type=customer&receiver=" + this.app_id + "&receiver_type=app_master";
        this.storeAppService.createChatSessionView(param, data).subscribe(function (res) {
            console.log(res);
            var thread = res['thread'];
            _this.getMessageList(thread);
        }, function (error) {
            console.log(error);
        });
    };
    StoreAppMessengerComponent.prototype.getMessageList = function (thread) {
        var _this = this;
        this.loader.show(this.lodaing_options);
        this.storeAppService.getMessageListByApp(thread).subscribe(function (res) {
            console.log(res);
            res.forEach(function (x) {
                var data = {
                    text: x.message,
                    created: x.datetime
                };
                if (x.chat_user == _this.user_id) {
                    data['sender'] = true;
                }
                else {
                    data['sender'] = false;
                }
                _this.messages.push(data);
                console.log(_this.messages);
                _this.scrollToBottom();
                _this.loader.hide();
            });
        }, function (error) {
            _this.loader.hide();
            console.log(error);
        });
    };
    StoreAppMessengerComponent.prototype.scrollToBottom = function () {
        var _this = this;
        setTimeout(function () {
            _this.scrollList.nativeElement.scrollToVerticalOffset(100000);
        }, 1000);
    };
    __decorate([
        core_1.ViewChild("ScrollList"),
        __metadata("design:type", core_1.ElementRef)
    ], StoreAppMessengerComponent.prototype, "scrollList", void 0);
    StoreAppMessengerComponent = __decorate([
        core_1.Component({
            selector: 'messenger',
            moduleId: module.id,
            templateUrl: "messenger.component.html",
            styleUrls: ["messenger.component.css"]
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            common_1.Location,
            store_app_service_1.StoreAppService,
            router_2.RouterExtensions,
            core_1.NgZone])
    ], StoreAppMessengerComponent);
    return StoreAppMessengerComponent;
}());
exports.StoreAppMessengerComponent = StoreAppMessengerComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lc3Nlbmdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBb0c7QUFDcEcsMENBQWlEO0FBQ2pELDBDQUEyQztBQUMzQyw4RUFBMkU7QUFFM0Usc0RBQStEO0FBQy9ELDZEQUEyRjtBQUMzRixPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNuQyxpRkFBa0U7QUFPbEU7SUFxQ0ksb0NBQ1ksS0FBcUIsRUFDckIsUUFBa0IsRUFDbEIsZUFBZ0MsRUFDaEMsTUFBd0IsRUFDeEIsSUFBWTtRQUpaLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBQ3hCLFNBQUksR0FBSixJQUFJLENBQVE7UUE5QnhCLFdBQU0sR0FBRyxJQUFJLGlEQUFnQixFQUFFLENBQUM7UUFDaEMsb0JBQWUsR0FBRztZQUNkLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFO2dCQUNMLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixVQUFVLEVBQUUsS0FBSztnQkFDakIsY0FBYyxFQUFFLFVBQVUsTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQSxDQUFDLENBQUM7Z0JBQ3RFLEdBQUcsRUFBRSxHQUFHO2dCQUNSLG9CQUFvQixFQUFFLFNBQVM7Z0JBQy9CLHFCQUFxQixFQUFFLElBQUk7Z0JBQzNCLGFBQWEsRUFBRSxDQUFDO2dCQUNoQixpQkFBaUIsRUFBRSxDQUFDO2FBQ3ZCO1lBQ0QsR0FBRyxFQUFFO2dCQUNELE9BQU8sRUFBRSx5QkFBeUI7Z0JBQ2xDLE1BQU0sRUFBRSxFQUFFO2dCQUNWLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixLQUFLLEVB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QTtnQkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQzFCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdEIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsRUFDRCxVQUFBLEtBQUs7WUFDRCxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdEIsQ0FBQyxDQUNKLENBQUE7SUFDTCxDQUFDO0lBRUQsbURBQWMsR0FBZDtRQUFBLGlCQUlDO1FBSEcsVUFBVSxDQUFDO1lBQ1AsS0FBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQS9Ld0I7UUFBeEIsZ0JBQVMsQ0FBQyxZQUFZLENBQUM7a0NBQWEsaUJBQVU7a0VBQUM7SUFWdkMsMEJBQTBCO1FBTnRDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsV0FBVztZQUNyQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLDBCQUEwQjtZQUN2QyxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUN6QyxDQUFDO3lDQXVDcUIsdUJBQWM7WUFDWCxpQkFBUTtZQUNELG1DQUFlO1lBQ3hCLHlCQUFnQjtZQUNsQixhQUFNO09BMUNmLDBCQUEwQixDQTBMdEM7SUFBRCxpQ0FBQztDQUFBLEFBMUxELElBMExDO0FBMUxZLGdFQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBPbkRlc3Ryb3ksIE5nWm9uZSwgSW5qZWN0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBTdG9yZUFwcFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vLi4vY29yZS9zZXJ2aWNlcy9zdG9yZS1hcHAuc2VydmljZVwiO1xyXG5pbXBvcnQgKiBhcyBUTlNQaG9uZSBmcm9tICduYXRpdmVzY3JpcHQtcGhvbmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBnZXRTdHJpbmcsIHNldFN0cmluZywgZ2V0Qm9vbGVhbiwgc2V0Qm9vbGVhbiwgY2xlYXIgfSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxucmVxdWlyZShcIm5hdGl2ZXNjcmlwdC13ZWJzb2NrZXRzXCIpO1xyXG5pbXBvcnQgeyBMb2FkaW5nSW5kaWNhdG9yIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1sb2FkaW5nLWluZGljYXRvclwiO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbWVzc2VuZ2VyJyxcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogYG1lc3Nlbmdlci5jb21wb25lbnQuaHRtbGAsXHJcbiAgICBzdHlsZVVybHM6IFtgbWVzc2VuZ2VyLmNvbXBvbmVudC5jc3NgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU3RvcmVBcHBNZXNzZW5nZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgICBhcHBfaWQ6IHN0cmluZztcclxuICAgIGFwcF9vd25lcl9kZXRhaWxzOiBhbnk7XHJcbiAgICB2aXNpYmxlX2tleTogYm9vbGVhbjtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHNvY2tldDogYW55O1xyXG4gICAgbWVzc2FnZXM6IEFycmF5PGFueT47XHJcbiAgICB1c2VyX2lkOiBzdHJpbmc7XHJcblxyXG5cclxuICAgIEBWaWV3Q2hpbGQoXCJTY3JvbGxMaXN0XCIpIHNjcm9sbExpc3Q6IEVsZW1lbnRSZWY7XHJcblxyXG4gICAgbG9hZGVyID0gbmV3IExvYWRpbmdJbmRpY2F0b3IoKTtcclxuICAgIGxvZGFpbmdfb3B0aW9ucyA9IHtcclxuICAgICAgICBtZXNzYWdlOiAnTG9hZGluZy4uLicsXHJcbiAgICAgICAgcHJvZ3Jlc3M6IDAuNjUsXHJcbiAgICAgICAgYW5kcm9pZDoge1xyXG4gICAgICAgICAgICBpbmRldGVybWluYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgY2FuY2VsTGlzdGVuZXI6IGZ1bmN0aW9uIChkaWFsb2cpIHsgY29uc29sZS5sb2coXCJMb2FkaW5nIGNhbmNlbGxlZFwiKSB9LFxyXG4gICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgcHJvZ3Jlc3NOdW1iZXJGb3JtYXQ6IFwiJTFkLyUyZFwiLFxyXG4gICAgICAgICAgICBwcm9ncmVzc1BlcmNlbnRGb3JtYXQ6IDAuNTMsXHJcbiAgICAgICAgICAgIHByb2dyZXNzU3R5bGU6IDEsXHJcbiAgICAgICAgICAgIHNlY29uZGFyeVByb2dyZXNzOiAxXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpb3M6IHtcclxuICAgICAgICAgICAgZGV0YWlsczogXCJBZGRpdGlvbmFsIGRldGFpbCBub3RlIVwiLFxyXG4gICAgICAgICAgICBtYXJnaW46IDEwLFxyXG4gICAgICAgICAgICBkaW1CYWNrZ3JvdW5kOiB0cnVlLFxyXG4gICAgICAgICAgICBjb2xvcjogXCIjNEI5RUQ2XCIsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ5ZWxsb3dcIixcclxuICAgICAgICAgICAgdXNlckludGVyYWN0aW9uRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgICAgIGhpZGVCZXplbDogdHJ1ZSxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sXHJcbiAgICAgICAgcHJpdmF0ZSBzdG9yZUFwcFNlcnZpY2U6IFN0b3JlQXBwU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucyxcclxuICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZVxyXG4gICAgKSB7XHJcblxyXG4gICAgICAgIHRoaXMubWVzc2FnZXMgPSBbXTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBcIlwiO1xyXG5cclxuICAgIH1cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHZhciBmdWxsX2xvY2F0aW9uID0gdGhpcy5sb2NhdGlvbi5wYXRoKCkuc3BsaXQoJy8nKTtcclxuICAgICAgICB0aGlzLmFwcF9pZCA9IGZ1bGxfbG9jYXRpb25bMl0udHJpbSgpO1xyXG4gICAgICAgIHRoaXMudXNlcl9pZCA9IGdldFN0cmluZygndXNlcl9pZCcpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhdFNlc3Npb24oKTtcclxuICAgICAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovLzEzMi4xNDguMTQ3LjIzOTo4MDAxL21lc3NhZ2VzLz9zZW5kZXI9XCIgKyB0aGlzLnVzZXJfaWQgKyBcIiZzZW5kZXJfdHlwZT1jdXN0b21lciZyZWNlaXZlcj1cIiArIHRoaXMuYXBwX2lkICsgXCImcmVjZWl2ZXJfdHlwZT1hcHBfbWFzdGVyXCIpO1xyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9IChldnQpID0+IHRoaXMub25PcGVuKGV2dClcclxuICAgICAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gKGV2dCkgPT4gdGhpcy5vbkNsb3NlKGV2dClcclxuICAgICAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSAoZXZ0KSA9PiB0aGlzLm9uTWVzc2FnZShldnQpXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub25lcnJvciA9IChldnQpID0+IHRoaXMub25FcnJvcihldnQpXHJcbiAgICB9XHJcblxyXG4gICAgb25PcGVuKGV2dCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2dClcclxuICAgICAgICAvLyB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuICAgICAgICAvLyAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgLy8gICAgICAgICB0ZXh0OiBcIldlbGNvbWUgdG8gdGhlIGNoYXQhXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgIC8vICAgICAgICAgc2VuZGVyOiBmYWxzZVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gICAgIHRoaXMubWVzc2FnZXMucHVzaChkYXRhKTtcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIldlbGNvbWUgdG8gdGhlIGNoYXQhXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ2xvc2UoZXZ0KSB7XHJcbiAgICAgICAgLy8gdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgLy8gICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgIC8vICAgICAgICAgdGV4dDogXCJZb3UgaGF2ZSBiZWVuIGRpc2Nvbm5lY3RlZFwiLFxyXG4gICAgICAgIC8vICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcclxuICAgICAgICAvLyAgICAgICAgIHNlbmRlcjogZmFsc2VcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJZb3UgaGF2ZSBiZWVuIGRpc2Nvbm5lY3RlZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1lc3NhZ2UoZXZ0KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShldnQuZGF0YSkpXHJcbiAgICAgICAgdmFyIG1zZ0RhdGEgPSBKU09OLnBhcnNlKGV2dC5kYXRhKVxyXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IG1zZ0RhdGEubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobXNnRGF0YS5jaGF0X3VzZXIgPT0gdGhpcy51c2VyX2lkKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWydzZW5kZXInXSA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbJ3NlbmRlciddID0gZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbkVycm9yKGV2dCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIHNvY2tldCBoYWQgYW4gZXJyb3JcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgLy8gdGhpcy5zb2NrZXQuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaXNWaWV3ZWQobWVzc2FnZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIHNlbmQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZSkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIGNoYXRfdXNlcjogdGhpcy51c2VyX2lkLFxyXG4gICAgICAgICAgICAgICAgY2hhdF91c2VyX3R5cGU6IFwiY3VzdG9tZXJcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgY3JlYXRlQ2hhdFNlc3Npb24oKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGNoYXRfdXNlcjogJycsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgICBjaGF0X3VzZXJfdHlwZTogJydcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhcmFtID0gXCI/c2VuZGVyPVwiICsgdGhpcy51c2VyX2lkICsgXCImc2VuZGVyX3R5cGU9Y3VzdG9tZXImcmVjZWl2ZXI9XCIgKyB0aGlzLmFwcF9pZCArIFwiJnJlY2VpdmVyX3R5cGU9YXBwX21hc3RlclwiXHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmVBcHBTZXJ2aWNlLmNyZWF0ZUNoYXRTZXNzaW9uVmlldyhwYXJhbSwgZGF0YSkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgICAgICAgICAgdmFyIHRocmVhZCA9IHJlc1sndGhyZWFkJ11cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0TWVzc2FnZUxpc3QodGhyZWFkKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldE1lc3NhZ2VMaXN0KHRocmVhZCkge1xyXG4gICAgICAgIHRoaXMubG9hZGVyLnNob3codGhpcy5sb2RhaW5nX29wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuc3RvcmVBcHBTZXJ2aWNlLmdldE1lc3NhZ2VMaXN0QnlBcHAodGhyZWFkKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIChyZXM6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgICAgICAgICAgICByZXMuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogeC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiB4LmRhdGV0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4LmNoYXRfdXNlciA9PSB0aGlzLnVzZXJfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVsnc2VuZGVyJ10gPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhWydzZW5kZXInXSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubWVzc2FnZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHNjcm9sbFRvQm90dG9tKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbExpc3QubmF0aXZlRWxlbWVudC5zY3JvbGxUb1ZlcnRpY2FsT2Zmc2V0KDEwMDAwMCk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICB9XHJcbn0iXX0=