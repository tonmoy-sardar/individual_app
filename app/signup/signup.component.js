"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page");
var forms_1 = require("@angular/forms");
var login_service_1 = require("../core/services/login.service");
var application_settings_1 = require("application-settings");
var router_1 = require("nativescript-angular/router");
var nativescript_feedback_1 = require("nativescript-feedback");
var color_1 = require("tns-core-modules/color");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
var SignupComponent = /** @class */ (function () {
    function SignupComponent(page, router, formBuilder, loginService) {
        this.page = page;
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginService = loginService;
        this.processing = false;
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
        this.page.actionBarHidden = true;
        this.feedback = new nativescript_feedback_1.Feedback();
    }
    SignupComponent.prototype.ngOnInit = function () {
        this.form = this.formBuilder.group({
            customer_name: ['', forms_1.Validators.required],
            email: ['', [
                    forms_1.Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
                ]],
            contact_no: ['', [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(10),
                    forms_1.Validators.maxLength(12)
                ]],
            password: ['', forms_1.Validators.required],
            app_store_flag: [0],
            app_id: [0],
        });
    };
    SignupComponent.prototype.markFormGroupTouched = function (formGroup) {
        var _this = this;
        Object.values(formGroup.controls).forEach(function (control) {
            control.markAsTouched();
            if (control.controls) {
                control.controls.forEach(function (c) { return _this.markFormGroupTouched(c); });
            }
        });
    };
    SignupComponent.prototype.signUp = function () {
        var _this = this;
        if (this.form.valid) {
            this.loader.show(this.lodaing_options);
            // this.processing = true;
            this.loginService.signup(this.form.value).subscribe(function (res) {
                console.log(res);
                // this.processing = false;
                application_settings_1.clear();
                application_settings_1.setBoolean("isLoggedin", true);
                if (res.email != "") {
                    application_settings_1.setString('email', res.email);
                }
                application_settings_1.setString('contact_no', res.contact_no);
                application_settings_1.setString('user_id', res.user_id.toString());
                _this.loader.hide();
                _this.router.navigate(['/']);
            }, function (error) {
                // this.processing = false;
                _this.loader.hide();
                console.log(error);
                _this.feedback.error({
                    title: "User already exists",
                    backgroundColor: new color_1.Color("red"),
                    titleColor: new color_1.Color("black"),
                    position: nativescript_feedback_1.FeedbackPosition.Bottom,
                    type: nativescript_feedback_1.FeedbackType.Custom
                });
            });
        }
        else {
            this.markFormGroupTouched(this.form);
        }
    };
    SignupComponent.prototype.isFieldValid = function (field) {
        return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
    };
    SignupComponent.prototype.displayFieldCss = function (field) {
        return {
            'is-invalid': this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched),
            'is-valid': this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched)
        };
    };
    SignupComponent = __decorate([
        core_1.Component({
            selector: "signup",
            moduleId: module.id,
            templateUrl: "./signup.component.html",
            styleUrls: ['./signup.component.css']
        }),
        __metadata("design:paramtypes", [page_1.Page,
            router_1.RouterExtensions,
            forms_1.FormBuilder,
            login_service_1.LoginService])
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpZ251cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFHbEQsaURBQWdEO0FBQ2hELHdDQUFvRTtBQUNwRSxnRUFBOEQ7QUFDOUQsNkRBQTJGO0FBQzNGLHNEQUErRDtBQUMvRCwrREFBaUY7QUFDakYsZ0RBQStDO0FBQy9DLGlGQUFrRTtBQU9sRTtJQTRCRSx5QkFDVSxJQUFVLEVBQ1YsTUFBd0IsRUFDeEIsV0FBd0IsRUFDeEIsWUFBMEI7UUFIMUIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNWLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBQ3hCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBOUJwQyxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBRW5CLFdBQU0sR0FBRyxJQUFJLGlEQUFnQixFQUFFLENBQUM7UUFDaEMsb0JBQWUsR0FBRztZQUNoQixPQUFPLEVBQUUsWUFBWTtZQUNyQixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsSUFBSTtnQkFDbkIsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLGNBQWMsRUFBRSxVQUFVLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUEsQ0FBQyxDQUFDO2dCQUN0RSxHQUFHLEVBQUUsR0FBRztnQkFDUixvQkFBb0IsRUFBRSxTQUFTO2dCQUMvQixxQkFBcUIsRUFBRSxJQUFJO2dCQUMzQixhQUFhLEVBQUUsQ0FBQztnQkFDaEIsaUJBQWlCLEVBQUUsQ0FBQzthQUNyQjtZQUNELEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUseUJBQXlCO2dCQUNsQyxNQUFNLEVBQUUsRUFBRTtnQkFDVixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLGVBQWUsRUFBRSxR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LENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUN2RyxDQUFDO0lBQ0osQ0FBQztJQWpIVSxlQUFlO1FBTjNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztTQUN0QyxDQUFDO3lDQThCZ0IsV0FBSTtZQUNGLHlCQUFnQjtZQUNYLG1CQUFXO1lBQ1YsNEJBQVk7T0FoQ3pCLGVBQWUsQ0FtSDNCO0lBQUQsc0JBQUM7Q0FBQSxBQW5IRCxJQW1IQztBQW5IWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgYWxlcnQsIHByb21wdCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2RpYWxvZ3NcIjtcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL3BhZ2VcIjtcclxuaW1wb3J0IHsgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSBcIi4uL2NvcmUvc2VydmljZXMvbG9naW4uc2VydmljZVwiO1xyXG5pbXBvcnQgeyBnZXRTdHJpbmcsIHNldFN0cmluZywgZ2V0Qm9vbGVhbiwgc2V0Qm9vbGVhbiwgY2xlYXIgfSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgRmVlZGJhY2ssIEZlZWRiYWNrVHlwZSwgRmVlZGJhY2tQb3NpdGlvbiB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZmVlZGJhY2tcIjtcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9jb2xvclwiO1xyXG5pbXBvcnQgeyBMb2FkaW5nSW5kaWNhdG9yIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1sb2FkaW5nLWluZGljYXRvclwiO1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJzaWdudXBcIixcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHRlbXBsYXRlVXJsOiBcIi4vc2lnbnVwLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbJy4vc2lnbnVwLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lnbnVwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBmb3JtOiBGb3JtR3JvdXA7XHJcbiAgcHJvY2Vzc2luZyA9IGZhbHNlO1xyXG4gIHByaXZhdGUgZmVlZGJhY2s6IEZlZWRiYWNrO1xyXG4gIGxvYWRlciA9IG5ldyBMb2FkaW5nSW5kaWNhdG9yKCk7XHJcbiAgbG9kYWluZ19vcHRpb25zID0ge1xyXG4gICAgbWVzc2FnZTogJ0xvYWRpbmcuLi4nLFxyXG4gICAgcHJvZ3Jlc3M6IDAuNjUsXHJcbiAgICBhbmRyb2lkOiB7XHJcbiAgICAgIGluZGV0ZXJtaW5hdGU6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxyXG4gICAgICBjYW5jZWxMaXN0ZW5lcjogZnVuY3Rpb24gKGRpYWxvZykgeyBjb25zb2xlLmxvZyhcIkxvYWRpbmcgY2FuY2VsbGVkXCIpIH0sXHJcbiAgICAgIG1heDogMTAwLFxyXG4gICAgICBwcm9ncmVzc051bWJlckZvcm1hdDogXCIlMWQvJTJkXCIsXHJcbiAgICAgIHByb2dyZXNzUGVyY2VudEZvcm1hdDogMC41MyxcclxuICAgICAgcHJvZ3Jlc3NTdHlsZTogMSxcclxuICAgICAgc2Vjb25kYXJ5UHJvZ3Jlc3M6IDFcclxuICAgIH0sXHJcbiAgICBpb3M6IHtcclxuICAgICAgZGV0YWlsczogXCJBZGRpdGlvbmFsIGRldGFpbCBub3RlIVwiLFxyXG4gICAgICBtYXJnaW46IDEwLFxyXG4gICAgICBkaW1CYWNrZ3JvdW5kOiB0cnVlLFxyXG4gICAgICBjb2xvcjogXCIjNEI5RUQ2XCIsXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ5ZWxsb3dcIixcclxuICAgICAgdXNlckludGVyYWN0aW9uRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgIGhpZGVCZXplbDogdHJ1ZSxcclxuICAgIH1cclxuICB9XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXHJcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucyxcclxuICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxyXG4gICAgcHJpdmF0ZSBsb2dpblNlcnZpY2U6IExvZ2luU2VydmljZVxyXG4gICkge1xyXG4gICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XHJcbiAgICB0aGlzLmZlZWRiYWNrID0gbmV3IEZlZWRiYWNrKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuXHJcbiAgICB0aGlzLmZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcclxuICAgICAgY3VzdG9tZXJfbmFtZTogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcclxuICAgICAgZW1haWw6IFsnJywgW1xyXG4gICAgICAgIFZhbGlkYXRvcnMucGF0dGVybigvXlthLXpBLVowLTkuXyUrLV0rQFthLXpBLVowLTkuLV0rXFwuW2EtekEtWl17Miw0fSQvKVxyXG4gICAgICBdXSxcclxuICAgICAgY29udGFjdF9ubzogWycnLCBbXHJcbiAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCxcclxuICAgICAgICBWYWxpZGF0b3JzLm1pbkxlbmd0aCgxMCksXHJcbiAgICAgICAgVmFsaWRhdG9ycy5tYXhMZW5ndGgoMTIpXHJcbiAgICAgIF1dLFxyXG4gICAgICBwYXNzd29yZDogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcclxuICAgICAgYXBwX3N0b3JlX2ZsYWc6IFswXSxcclxuICAgICAgYXBwX2lkOiBbMF0sXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgbWFya0Zvcm1Hcm91cFRvdWNoZWQoZm9ybUdyb3VwOiBGb3JtR3JvdXApIHtcclxuICAgICg8YW55Pk9iamVjdCkudmFsdWVzKGZvcm1Hcm91cC5jb250cm9scykuZm9yRWFjaChjb250cm9sID0+IHtcclxuICAgICAgY29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XHJcbiAgICAgIGlmIChjb250cm9sLmNvbnRyb2xzKSB7XHJcbiAgICAgICAgY29udHJvbC5jb250cm9scy5mb3JFYWNoKGMgPT4gdGhpcy5tYXJrRm9ybUdyb3VwVG91Y2hlZChjKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2lnblVwKCkge1xyXG4gICAgaWYgKHRoaXMuZm9ybS52YWxpZCkge1xyXG4gICAgICB0aGlzLmxvYWRlci5zaG93KHRoaXMubG9kYWluZ19vcHRpb25zKTtcclxuICAgICAgLy8gdGhpcy5wcm9jZXNzaW5nID0gdHJ1ZTtcclxuICAgICAgdGhpcy5sb2dpblNlcnZpY2Uuc2lnbnVwKHRoaXMuZm9ybS52YWx1ZSkuc3Vic2NyaWJlKFxyXG4gICAgICAgIHJlcyA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgICAgICAvLyB0aGlzLnByb2Nlc3NpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICBzZXRCb29sZWFuKFwiaXNMb2dnZWRpblwiLCB0cnVlKVxyXG4gICAgICAgICAgaWYocmVzLmVtYWlsICE9IFwiXCIpe1xyXG4gICAgICAgICAgICBzZXRTdHJpbmcoJ2VtYWlsJywgcmVzLmVtYWlsKVxyXG4gICAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICAgIHNldFN0cmluZygnY29udGFjdF9ubycsIHJlcy5jb250YWN0X25vKVxyXG4gICAgICAgICAgc2V0U3RyaW5nKCd1c2VyX2lkJywgcmVzLnVzZXJfaWQudG9TdHJpbmcoKSlcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGUoKTtcclxuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnLyddKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgLy8gdGhpcy5wcm9jZXNzaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlKCk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICAgIHRoaXMuZmVlZGJhY2suZXJyb3Ioe1xyXG4gICAgICAgICAgICB0aXRsZTogXCJVc2VyIGFscmVhZHkgZXhpc3RzXCIsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbmV3IENvbG9yKFwicmVkXCIpLFxyXG4gICAgICAgICAgICB0aXRsZUNvbG9yOiBuZXcgQ29sb3IoXCJibGFja1wiKSxcclxuICAgICAgICAgICAgcG9zaXRpb246IEZlZWRiYWNrUG9zaXRpb24uQm90dG9tLFxyXG4gICAgICAgICAgICB0eXBlOiBGZWVkYmFja1R5cGUuQ3VzdG9tXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLm1hcmtGb3JtR3JvdXBUb3VjaGVkKHRoaXMuZm9ybSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzRmllbGRWYWxpZChmaWVsZDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gIXRoaXMuZm9ybS5nZXQoZmllbGQpLnZhbGlkICYmICh0aGlzLmZvcm0uZ2V0KGZpZWxkKS5kaXJ0eSB8fCB0aGlzLmZvcm0uZ2V0KGZpZWxkKS50b3VjaGVkKTtcclxuICB9XHJcblxyXG4gIGRpc3BsYXlGaWVsZENzcyhmaWVsZDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAnaXMtaW52YWxpZCc6IHRoaXMuZm9ybS5nZXQoZmllbGQpLmludmFsaWQgJiYgKHRoaXMuZm9ybS5nZXQoZmllbGQpLmRpcnR5IHx8IHRoaXMuZm9ybS5nZXQoZmllbGQpLnRvdWNoZWQpLFxyXG4gICAgICAnaXMtdmFsaWQnOiB0aGlzLmZvcm0uZ2V0KGZpZWxkKS52YWxpZCAmJiAodGhpcy5mb3JtLmdldChmaWVsZCkuZGlydHkgfHwgdGhpcy5mb3JtLmdldChmaWVsZCkudG91Y2hlZClcclxuICAgIH07XHJcbiAgfVxyXG5cclxufSJdfQ==