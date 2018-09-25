"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var Globals = require("../../core/globals");
var LoginService = /** @class */ (function () {
    function LoginService(http) {
        this.http = http;
    }
    LoginService.prototype.login = function (data) {
        return this.http.post(Globals.apiEndpoint + 'customer_login/', data);
    };
    LoginService.prototype.signup = function (data) {
        return this.http.post(Globals.apiEndpoint + 'customer_registration/', data);
    };
    LoginService.prototype.customerForgetPasswordOtp = function (data) {
        return this.http.post(Globals.apiEndpoint + 'customer_forget_password_otp/', data);
    };
    LoginService.prototype.userForgetPasswordUpdate = function (data) {
        return this.http.put(Globals.apiEndpoint + 'customer_forget_password_update/', data);
    };
    LoginService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsNkNBSzhCO0FBRzlCLDRDQUE4QztBQUc5QztJQUVFLHNCQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUksQ0FBQztJQUV6Qyw0QkFBSyxHQUFMLFVBQU0sSUFBSTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ3RFLENBQUM7SUFFRCw2QkFBTSxHQUFOLFVBQU8sSUFBSTtRQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLHdCQUF3QixFQUFFLElBQUksQ0FBQyxDQUFBO0lBQzdFLENBQUM7SUFFRCxnREFBeUIsR0FBekIsVUFBMEIsSUFBSTtRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRywrQkFBK0IsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNwRixDQUFDO0lBRUQsK0NBQXdCLEdBQXhCLFVBQXlCLElBQUk7UUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsa0NBQWtDLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDdEYsQ0FBQztJQWxCVSxZQUFZO1FBRHhCLGlCQUFVLEVBQUU7eUNBR2UsaUJBQVU7T0FGekIsWUFBWSxDQXFCeEI7SUFBRCxtQkFBQztDQUFBLEFBckJELElBcUJDO0FBckJZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7XHJcbiAgSHR0cENsaWVudCxcclxuICBIdHRwSGVhZGVycyxcclxuICBIdHRwRXJyb3JSZXNwb25zZSxcclxuICBIdHRwUGFyYW1zLFxyXG59IGZyb20gXCJAYW5ndWxhci9jb21tb24vaHR0cFwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QsIHRocm93RXJyb3IgfSBmcm9tIFwicnhqc1wiO1xyXG5pbXBvcnQgeyBtYXAsIGNhdGNoRXJyb3IgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcclxuaW1wb3J0ICogYXMgR2xvYmFscyBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbHMnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTG9naW5TZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cclxuXHJcbiAgbG9naW4oZGF0YSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoR2xvYmFscy5hcGlFbmRwb2ludCArICdjdXN0b21lcl9sb2dpbi8nLCBkYXRhKVxyXG4gIH1cclxuXHJcbiAgc2lnbnVwKGRhdGEpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KEdsb2JhbHMuYXBpRW5kcG9pbnQgKyAnY3VzdG9tZXJfcmVnaXN0cmF0aW9uLycsIGRhdGEpXHJcbiAgfVxyXG5cclxuICBjdXN0b21lckZvcmdldFBhc3N3b3JkT3RwKGRhdGEpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KEdsb2JhbHMuYXBpRW5kcG9pbnQgKyAnY3VzdG9tZXJfZm9yZ2V0X3Bhc3N3b3JkX290cC8nLCBkYXRhKVxyXG4gIH1cclxuICBcclxuICB1c2VyRm9yZ2V0UGFzc3dvcmRVcGRhdGUoZGF0YSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dChHbG9iYWxzLmFwaUVuZHBvaW50ICsgJ2N1c3RvbWVyX2ZvcmdldF9wYXNzd29yZF91cGRhdGUvJywgZGF0YSlcclxuICB9XHJcbiAgXHJcbiAgXHJcbn1cclxuIl19