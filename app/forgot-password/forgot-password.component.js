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
var dialogs_1 = require("nativescript-angular/directives/dialogs");
var ForgotPasswordComponent = /** @class */ (function () {
    function ForgotPasswordComponent(page, router, formBuilder, loginService, modal, vcRef) {
        this.page = page;
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginService = loginService;
        this.modal = modal;
        this.vcRef = vcRef;
        this.processing = false;
        this.showOtpSection = false;
        this.newPwdSection = false;
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
        this.options = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.page.actionBarHidden = true;
        this.feedback = new nativescript_feedback_1.Feedback();
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
        this.form = this.formBuilder.group({
            contact_no: ['', forms_1.Validators.required],
            app_store_flag: [0],
            app_id: [0],
        });
        this.otpForm = this.formBuilder.group({
            otp: ['', forms_1.Validators.required]
        });
        this.passwordForm = this.formBuilder.group({
            password: ['', forms_1.Validators.required],
            conf_password: ['', forms_1.Validators.required]
        });
    };
    ForgotPasswordComponent.prototype.isFieldValid = function (field) {
        return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
    };
    ForgotPasswordComponent.prototype.isFieldValid1 = function (field) {
        return !this.otpForm.get(field).valid && (this.otpForm.get(field).dirty || this.otpForm.get(field).touched);
    };
    ForgotPasswordComponent.prototype.isFieldValid2 = function (field) {
        return !this.passwordForm.get(field).valid && (this.passwordForm.get(field).dirty || this.passwordForm.get(field).touched);
    };
    ForgotPasswordComponent.prototype.displayFieldCss = function (field) {
        return {
            'is-invalid': this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched),
            'is-valid': this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched)
        };
    };
    ForgotPasswordComponent.prototype.displayFieldCss1 = function (field) {
        return {
            'is-invalid': this.otpForm.get(field).invalid && (this.otpForm.get(field).dirty || this.otpForm.get(field).touched),
            'is-valid': this.otpForm.get(field).valid && (this.otpForm.get(field).dirty || this.otpForm.get(field).touched)
        };
    };
    ForgotPasswordComponent.prototype.displayFieldCss2 = function (field) {
        return {
            'is-invalid': this.passwordForm.get(field).invalid && (this.passwordForm.get(field).dirty || this.passwordForm.get(field).touched),
            'is-valid': this.passwordForm.get(field).valid && (this.passwordForm.get(field).dirty || this.passwordForm.get(field).touched)
        };
    };
    ForgotPasswordComponent.prototype.customerForgotPasswordOtp = function () {
        var _this = this;
        if (this.form.valid) {
            this.loader.show(this.lodaing_options);
            this.contact_no = this.form.value.contact_no;
            this.loginService.customerForgetPasswordOtp(this.form.value).subscribe(function (res) {
                _this.loader.hide();
                console.log(res);
                _this.otp = res.otp;
                _this.showOtpSection = true;
            }, function (error) {
                _this.loader.hide();
                console.log(error);
                _this.feedback.error({
                    title: error.error.msg,
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
    ForgotPasswordComponent.prototype.resendOtp = function () {
        var _this = this;
        this.loader.show(this.lodaing_options);
        var data = {
            contact_no: this.contact_no,
            app_store_flag: 0,
            app_id: 0,
        };
        this.loginService.customerForgetPasswordOtp(data).subscribe(function (res) {
            _this.loader.hide();
            console.log(res);
            _this.otp = res.otp;
            _this.showOtpSection = true;
        }, function (error) {
            _this.loader.hide();
            console.log(error);
            _this.feedback.error({
                title: error.error.msg,
                backgroundColor: new color_1.Color("red"),
                titleColor: new color_1.Color("black"),
                position: nativescript_feedback_1.FeedbackPosition.Bottom,
                type: nativescript_feedback_1.FeedbackType.Custom
            });
        });
    };
    ForgotPasswordComponent.prototype.submitOtp = function () {
        if (this.otp == this.otpForm.value.otp) {
            this.newPwdSection = true;
            this.otp_check = 1;
        }
        else {
            this.feedback.error({
                title: 'Please Enter Valid OTP',
                backgroundColor: new color_1.Color("red"),
                titleColor: new color_1.Color("black"),
                position: nativescript_feedback_1.FeedbackPosition.Bottom,
                type: nativescript_feedback_1.FeedbackType.Custom
            });
        }
    };
    ForgotPasswordComponent.prototype.submitNewPwd = function () {
        var _this = this;
        if (this.passwordForm.valid) {
            if (this.passwordForm.value.conf_password != this.passwordForm.value.password) {
                this.feedback.error({
                    title: 'Password & Confirm Password are not same',
                    backgroundColor: new color_1.Color("red"),
                    titleColor: new color_1.Color("black"),
                    position: nativescript_feedback_1.FeedbackPosition.Bottom,
                    type: nativescript_feedback_1.FeedbackType.Custom
                });
            }
            else {
                this.loader.show(this.lodaing_options);
                var data = {
                    contact_no: this.contact_no,
                    otp_check: this.otp_check,
                    password: this.passwordForm.value.password,
                    app_store_flag: 0,
                    app_id: 0
                };
                this.loginService.userForgetPasswordUpdate(data).subscribe(function (res) {
                    _this.loader.hide();
                    _this.feedback.success({
                        title: 'Password has been successfully changed. ',
                        backgroundColor: new color_1.Color("green"),
                        titleColor: new color_1.Color("black"),
                        position: nativescript_feedback_1.FeedbackPosition.Bottom,
                        type: nativescript_feedback_1.FeedbackType.Custom
                    });
                    _this.router.navigate(['/login']);
                }, function (error) {
                    _this.loader.hide();
                    console.log(error);
                    _this.feedback.error({
                        title: error.error.msg,
                        backgroundColor: new color_1.Color("red"),
                        titleColor: new color_1.Color("black"),
                        position: nativescript_feedback_1.FeedbackPosition.Bottom,
                        type: nativescript_feedback_1.FeedbackType.Custom
                    });
                });
            }
        }
        else {
            this.markFormGroupTouched(this.form);
        }
    };
    ForgotPasswordComponent.prototype.markFormGroupTouched = function (formGroup) {
        var _this = this;
        Object.values(formGroup.controls).forEach(function (control) {
            control.markAsTouched();
            if (control.controls) {
                control.controls.forEach(function (c) { return _this.markFormGroupTouched(c); });
            }
        });
    };
    ForgotPasswordComponent.prototype.skip = function () {
        application_settings_1.setBoolean("isSkipped", true);
        this.router.navigate(['/']);
    };
    ForgotPasswordComponent = __decorate([
        core_1.Component({
            selector: "forgot-password",
            moduleId: module.id,
            templateUrl: "./forgot-password.component.html",
            styleUrls: ['./forgot-password.component.css']
        }),
        __metadata("design:paramtypes", [page_1.Page,
            router_1.RouterExtensions,
            forms_1.FormBuilder,
            login_service_1.LoginService,
            dialogs_1.ModalDialogService,
            core_1.ViewContainerRef])
    ], ForgotPasswordComponent);
    return ForgotPasswordComponent;
}());
exports.ForgotPasswordComponent = ForgotPasswordComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290LXBhc3N3b3JkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcmdvdC1wYXNzd29yZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBb0U7QUFHcEUsaURBQWdEO0FBQ2hELHdDQUFvRTtBQUNwRSxnRUFBOEQ7QUFDOUQsNkRBQTJGO0FBQzNGLHNEQUErRDtBQUMvRCwrREFBaUY7QUFDakYsZ0RBQStDO0FBQy9DLGlGQUFrRTtBQUNsRSxtRUFBNkU7QUFTN0U7SUF5Q0UsaUNBQ1UsSUFBVSxFQUNWLE1BQXdCLEVBQ3hCLFdBQXdCLEVBQ3hCLFlBQTBCLEVBQzFCLEtBQXlCLEVBQ3pCLEtBQXVCO1FBTHZCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixVQUFLLEdBQUwsS0FBSyxDQUFvQjtRQUN6QixVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQTNDakMsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUN2QixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUl0QixXQUFNLEdBQUcsSUFBSSxpREFBZ0IsRUFBRSxDQUFDO1FBRWhDLG9CQUFlLEdBQUc7WUFDaEIsT0FBTyxFQUFFLFlBQVk7WUFDckIsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUU7Z0JBQ1AsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixjQUFjLEVBQUUsVUFBVSxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBLENBQUMsQ0FBQztnQkFDdEUsR0FBRyxFQUFFLEdBQUc7Z0JBQ1Isb0JBQW9CLEVBQUUsU0FBUztnQkFDL0IscUJBQXFCLEVBQUUsSUFBSTtnQkFDM0IsYUFB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TSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDN0IsQ0FBQztJQWhRVSx1QkFBdUI7UUFObkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxrQ0FBa0M7WUFDL0MsU0FBUyxFQUFFLENBQUMsaUNBQWlDLENBQUM7U0FDL0MsQ0FBQzt5Q0EyQ2dCLFdBQUk7WUFDRix5QkFBZ0I7WUFDWCxtQkFBVztZQUNWLDRCQUFZO1lBQ25CLDRCQUFrQjtZQUNsQix1QkFBZ0I7T0EvQ3RCLHVCQUF1QixDQW9RbkM7SUFBRCw4QkFBQztDQUFBLEFBcFFELElBb1FDO0FBcFFZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVmlld0NvbnRhaW5lclJlZiwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBhbGVydCwgcHJvbXB0IH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZGlhbG9nc1wiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tIFwiLi4vY29yZS9zZXJ2aWNlcy9sb2dpbi5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IGdldFN0cmluZywgc2V0U3RyaW5nLCBnZXRCb29sZWFuLCBzZXRCb29sZWFuLCBjbGVhciB9IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBGZWVkYmFjaywgRmVlZGJhY2tUeXBlLCBGZWVkYmFja1Bvc2l0aW9uIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1mZWVkYmFja1wiO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2NvbG9yXCI7XHJcbmltcG9ydCB7IExvYWRpbmdJbmRpY2F0b3IgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWxvYWRpbmctaW5kaWNhdG9yXCI7XHJcbmltcG9ydCB7IE1vZGFsRGlhbG9nU2VydmljZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9kaXJlY3RpdmVzL2RpYWxvZ3NcIjtcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJmb3Jnb3QtcGFzc3dvcmRcIixcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHRlbXBsYXRlVXJsOiBcIi4vZm9yZ290LXBhc3N3b3JkLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZm9yZ290LXBhc3N3b3JkLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRm9yZ290UGFzc3dvcmRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGZvcm06IEZvcm1Hcm91cDtcclxuICBvdHBGb3JtOiBGb3JtR3JvdXA7XHJcbiAgcGFzc3dvcmRGb3JtOiBGb3JtR3JvdXA7XHJcbiAgcHJvY2Vzc2luZyA9IGZhbHNlO1xyXG4gIHNob3dPdHBTZWN0aW9uID0gZmFsc2U7XHJcbiAgbmV3UHdkU2VjdGlvbiA9IGZhbHNlO1xyXG4gIGNvbnRhY3Rfbm87XHJcbiAgb3RwX2NoZWNrO1xyXG4gIHByaXZhdGUgZmVlZGJhY2s6IEZlZWRiYWNrO1xyXG4gIGxvYWRlciA9IG5ldyBMb2FkaW5nSW5kaWNhdG9yKCk7XHJcbiAgb3RwO1xyXG4gIGxvZGFpbmdfb3B0aW9ucyA9IHtcclxuICAgIG1lc3NhZ2U6ICdMb2FkaW5nLi4uJyxcclxuICAgIHByb2dyZXNzOiAwLjY1LFxyXG4gICAgYW5kcm9pZDoge1xyXG4gICAgICBpbmRldGVybWluYXRlOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgY2FuY2VsTGlzdGVuZXI6IGZ1bmN0aW9uIChkaWFsb2cpIHsgY29uc29sZS5sb2coXCJMb2FkaW5nIGNhbmNlbGxlZFwiKSB9LFxyXG4gICAgICBtYXg6IDEwMCxcclxuICAgICAgcHJvZ3Jlc3NOdW1iZXJGb3JtYXQ6IFwiJTFkLyUyZFwiLFxyXG4gICAgICBwcm9ncmVzc1BlcmNlbnRGb3JtYXQ6IDAuNTMsXHJcbiAgICAgIHByb2dyZXNzU3R5bGU6IDEsXHJcbiAgICAgIHNlY29uZGFyeVByb2dyZXNzOiAxXHJcbiAgICB9LFxyXG4gICAgaW9zOiB7XHJcbiAgICAgIGRldGFpbHM6IFwiQWRkaXRpb25hbCBkZXRhaWwgbm90ZSFcIixcclxuICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgZGltQmFja2dyb3VuZDogdHJ1ZSxcclxuICAgICAgY29sb3I6IFwiIzRCOUVENlwiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwieWVsbG93XCIsXHJcbiAgICAgIHVzZXJJbnRlcmFjdGlvbkVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICBoaWRlQmV6ZWw6IHRydWUsXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9wdGlvbnMgPSB7XHJcbiAgICBjb250ZXh0OiB7fSxcclxuICAgIGZ1bGxzY3JlZW46IGZhbHNlLFxyXG4gICAgdmlld0NvbnRhaW5lclJlZjogdGhpcy52Y1JlZlxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMsXHJcbiAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcclxuICAgIHByaXZhdGUgbG9naW5TZXJ2aWNlOiBMb2dpblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG1vZGFsOiBNb2RhbERpYWxvZ1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxyXG4gICkge1xyXG4gICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XHJcbiAgICB0aGlzLmZlZWRiYWNrID0gbmV3IEZlZWRiYWNrKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICBjb250YWN0X25vOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxyXG4gICAgICBhcHBfc3RvcmVfZmxhZzogWzBdLFxyXG4gICAgICBhcHBfaWQ6IFswXSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub3RwRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICBvdHA6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucGFzc3dvcmRGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XHJcbiAgICAgIHBhc3N3b3JkOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxyXG4gICAgICBjb25mX3Bhc3N3b3JkOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBpc0ZpZWxkVmFsaWQoZmllbGQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuICF0aGlzLmZvcm0uZ2V0KGZpZWxkKS52YWxpZCAmJiAodGhpcy5mb3JtLmdldChmaWVsZCkuZGlydHkgfHwgdGhpcy5mb3JtLmdldChmaWVsZCkudG91Y2hlZCk7XHJcbiAgfVxyXG4gIGlzRmllbGRWYWxpZDEoZmllbGQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuICF0aGlzLm90cEZvcm0uZ2V0KGZpZWxkKS52YWxpZCAmJiAodGhpcy5vdHBGb3JtLmdldChmaWVsZCkuZGlydHkgfHwgdGhpcy5vdHBGb3JtLmdldChmaWVsZCkudG91Y2hlZCk7XHJcbiAgfVxyXG4gIGlzRmllbGRWYWxpZDIoZmllbGQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuICF0aGlzLnBhc3N3b3JkRm9ybS5nZXQoZmllbGQpLnZhbGlkICYmICh0aGlzLnBhc3N3b3JkRm9ybS5nZXQoZmllbGQpLmRpcnR5IHx8IHRoaXMucGFzc3dvcmRGb3JtLmdldChmaWVsZCkudG91Y2hlZCk7XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5RmllbGRDc3MoZmllbGQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgJ2lzLWludmFsaWQnOiB0aGlzLmZvcm0uZ2V0KGZpZWxkKS5pbnZhbGlkICYmICh0aGlzLmZvcm0uZ2V0KGZpZWxkKS5kaXJ0eSB8fCB0aGlzLmZvcm0uZ2V0KGZpZWxkKS50b3VjaGVkKSxcclxuICAgICAgJ2lzLXZhbGlkJzogdGhpcy5mb3JtLmdldChmaWVsZCkudmFsaWQgJiYgKHRoaXMuZm9ybS5nZXQoZmllbGQpLmRpcnR5IHx8IHRoaXMuZm9ybS5nZXQoZmllbGQpLnRvdWNoZWQpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheUZpZWxkQ3NzMShmaWVsZDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAnaXMtaW52YWxpZCc6IHRoaXMub3RwRm9ybS5nZXQoZmllbGQpLmludmFsaWQgJiYgKHRoaXMub3RwRm9ybS5nZXQoZmllbGQpLmRpcnR5IHx8IHRoaXMub3RwRm9ybS5nZXQoZmllbGQpLnRvdWNoZWQpLFxyXG4gICAgICAnaXMtdmFsaWQnOiB0aGlzLm90cEZvcm0uZ2V0KGZpZWxkKS52YWxpZCAmJiAodGhpcy5vdHBGb3JtLmdldChmaWVsZCkuZGlydHkgfHwgdGhpcy5vdHBGb3JtLmdldChmaWVsZCkudG91Y2hlZClcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5RmllbGRDc3MyKGZpZWxkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICdpcy1pbnZhbGlkJzogdGhpcy5wYXNzd29yZEZvcm0uZ2V0KGZpZWxkKS5pbnZhbGlkICYmICh0aGlzLnBhc3N3b3JkRm9ybS5nZXQoZmllbGQpLmRpcnR5IHx8IHRoaXMucGFzc3dvcmRGb3JtLmdldChmaWVsZCkudG91Y2hlZCksXHJcbiAgICAgICdpcy12YWxpZCc6IHRoaXMucGFzc3dvcmRGb3JtLmdldChmaWVsZCkudmFsaWQgJiYgKHRoaXMucGFzc3dvcmRGb3JtLmdldChmaWVsZCkuZGlydHkgfHwgdGhpcy5wYXNzd29yZEZvcm0uZ2V0KGZpZWxkKS50b3VjaGVkKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgY3VzdG9tZXJGb3Jnb3RQYXNzd29yZE90cCgpIHtcclxuXHJcbiAgICBpZiAodGhpcy5mb3JtLnZhbGlkKSB7XHJcbiAgICAgIHRoaXMubG9hZGVyLnNob3codGhpcy5sb2RhaW5nX29wdGlvbnMpO1xyXG4gICAgICB0aGlzLmNvbnRhY3Rfbm8gPSB0aGlzLmZvcm0udmFsdWUuY29udGFjdF9ubztcclxuICAgICAgdGhpcy5sb2dpblNlcnZpY2UuY3VzdG9tZXJGb3JnZXRQYXNzd29yZE90cCh0aGlzLmZvcm0udmFsdWUpLnN1YnNjcmliZShcclxuICAgICAgICByZXMgPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZSgpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgICAgdGhpcy5vdHAgPSByZXMub3RwXHJcbiAgICAgICAgICB0aGlzLnNob3dPdHBTZWN0aW9uID0gdHJ1ZTtcclxuXHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3IgPT4ge1xyXG5cclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGUoKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgICAgdGhpcy5mZWVkYmFjay5lcnJvcih7XHJcbiAgICAgICAgICAgIHRpdGxlOiBlcnJvci5lcnJvci5tc2csXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbmV3IENvbG9yKFwicmVkXCIpLFxyXG4gICAgICAgICAgICB0aXRsZUNvbG9yOiBuZXcgQ29sb3IoXCJibGFja1wiKSxcclxuICAgICAgICAgICAgcG9zaXRpb246IEZlZWRiYWNrUG9zaXRpb24uQm90dG9tLFxyXG4gICAgICAgICAgICB0eXBlOiBGZWVkYmFja1R5cGUuQ3VzdG9tXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLm1hcmtGb3JtR3JvdXBUb3VjaGVkKHRoaXMuZm9ybSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlc2VuZE90cCgpIHtcclxuICAgIHRoaXMubG9hZGVyLnNob3codGhpcy5sb2RhaW5nX29wdGlvbnMpO1xyXG5cclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICBjb250YWN0X25vOiB0aGlzLmNvbnRhY3Rfbm8sXHJcbiAgICAgIGFwcF9zdG9yZV9mbGFnOiAwLFxyXG4gICAgICBhcHBfaWQ6IDAsXHJcbiAgICB9XHJcbiAgICB0aGlzLmxvZ2luU2VydmljZS5jdXN0b21lckZvcmdldFBhc3N3b3JkT3RwKGRhdGEpLnN1YnNjcmliZShcclxuICAgICAgcmVzID0+IHtcclxuICAgICAgICB0aGlzLmxvYWRlci5oaWRlKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgIHRoaXMub3RwID0gcmVzLm90cFxyXG4gICAgICAgIHRoaXMuc2hvd090cFNlY3Rpb24gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvciA9PiB7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZGVyLmhpZGUoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICB0aGlzLmZlZWRiYWNrLmVycm9yKHtcclxuICAgICAgICAgIHRpdGxlOiBlcnJvci5lcnJvci5tc2csXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG5ldyBDb2xvcihcInJlZFwiKSxcclxuICAgICAgICAgIHRpdGxlQ29sb3I6IG5ldyBDb2xvcihcImJsYWNrXCIpLFxyXG4gICAgICAgICAgcG9zaXRpb246IEZlZWRiYWNrUG9zaXRpb24uQm90dG9tLFxyXG4gICAgICAgICAgdHlwZTogRmVlZGJhY2tUeXBlLkN1c3RvbVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBzdWJtaXRPdHAoKSB7XHJcbiAgICBpZiAodGhpcy5vdHAgPT0gdGhpcy5vdHBGb3JtLnZhbHVlLm90cCkge1xyXG5cclxuICAgICAgdGhpcy5uZXdQd2RTZWN0aW9uID0gdHJ1ZTtcclxuICAgICAgdGhpcy5vdHBfY2hlY2sgPSAxO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuZmVlZGJhY2suZXJyb3Ioe1xyXG4gICAgICAgIHRpdGxlOiAnUGxlYXNlIEVudGVyIFZhbGlkIE9UUCcsXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBuZXcgQ29sb3IoXCJyZWRcIiksXHJcbiAgICAgICAgdGl0bGVDb2xvcjogbmV3IENvbG9yKFwiYmxhY2tcIiksXHJcbiAgICAgICAgcG9zaXRpb246IEZlZWRiYWNrUG9zaXRpb24uQm90dG9tLFxyXG4gICAgICAgIHR5cGU6IEZlZWRiYWNrVHlwZS5DdXN0b21cclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuICBzdWJtaXROZXdQd2QoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMucGFzc3dvcmRGb3JtLnZhbGlkKSB7XHJcbiAgICAgIGlmICh0aGlzLnBhc3N3b3JkRm9ybS52YWx1ZS5jb25mX3Bhc3N3b3JkICE9IHRoaXMucGFzc3dvcmRGb3JtLnZhbHVlLnBhc3N3b3JkKSB7XHJcbiAgICAgICAgdGhpcy5mZWVkYmFjay5lcnJvcih7XHJcbiAgICAgICAgICB0aXRsZTogJ1Bhc3N3b3JkICYgQ29uZmlybSBQYXNzd29yZCBhcmUgbm90IHNhbWUnLFxyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBuZXcgQ29sb3IoXCJyZWRcIiksXHJcbiAgICAgICAgICB0aXRsZUNvbG9yOiBuZXcgQ29sb3IoXCJibGFja1wiKSxcclxuICAgICAgICAgIHBvc2l0aW9uOiBGZWVkYmFja1Bvc2l0aW9uLkJvdHRvbSxcclxuICAgICAgICAgIHR5cGU6IEZlZWRiYWNrVHlwZS5DdXN0b21cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmxvYWRlci5zaG93KHRoaXMubG9kYWluZ19vcHRpb25zKTtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgIGNvbnRhY3Rfbm86IHRoaXMuY29udGFjdF9ubyxcclxuICAgICAgICAgIG90cF9jaGVjazogdGhpcy5vdHBfY2hlY2ssXHJcbiAgICAgICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZEZvcm0udmFsdWUucGFzc3dvcmQsXHJcbiAgICAgICAgICBhcHBfc3RvcmVfZmxhZzogMCxcclxuICAgICAgICAgIGFwcF9pZDogMFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ2luU2VydmljZS51c2VyRm9yZ2V0UGFzc3dvcmRVcGRhdGUoZGF0YSkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgcmVzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrLnN1Y2Nlc3Moe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiAnUGFzc3dvcmQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNoYW5nZWQuICcsXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBuZXcgQ29sb3IoXCJncmVlblwiKSxcclxuICAgICAgICAgICAgICB0aXRsZUNvbG9yOiBuZXcgQ29sb3IoXCJibGFja1wiKSxcclxuICAgICAgICAgICAgICBwb3NpdGlvbjogRmVlZGJhY2tQb3NpdGlvbi5Cb3R0b20sXHJcbiAgICAgICAgICAgICAgdHlwZTogRmVlZGJhY2tUeXBlLkN1c3RvbVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvbG9naW4nXSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvciA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrLmVycm9yKHtcclxuICAgICAgICAgICAgICB0aXRsZTogZXJyb3IuZXJyb3IubXNnLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbmV3IENvbG9yKFwicmVkXCIpLFxyXG4gICAgICAgICAgICAgIHRpdGxlQ29sb3I6IG5ldyBDb2xvcihcImJsYWNrXCIpLFxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBGZWVkYmFja1Bvc2l0aW9uLkJvdHRvbSxcclxuICAgICAgICAgICAgICB0eXBlOiBGZWVkYmFja1R5cGUuQ3VzdG9tXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIClcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5tYXJrRm9ybUdyb3VwVG91Y2hlZCh0aGlzLmZvcm0pXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICB9XHJcblxyXG4gIG1hcmtGb3JtR3JvdXBUb3VjaGVkKGZvcm1Hcm91cDogRm9ybUdyb3VwKSB7XHJcbiAgICAoPGFueT5PYmplY3QpLnZhbHVlcyhmb3JtR3JvdXAuY29udHJvbHMpLmZvckVhY2goY29udHJvbCA9PiB7XHJcbiAgICAgIGNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xyXG4gICAgICBpZiAoY29udHJvbC5jb250cm9scykge1xyXG4gICAgICAgIGNvbnRyb2wuY29udHJvbHMuZm9yRWFjaChjID0+IHRoaXMubWFya0Zvcm1Hcm91cFRvdWNoZWQoYykpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNraXAoKSB7XHJcbiAgICBzZXRCb29sZWFuKFwiaXNTa2lwcGVkXCIsIHRydWUpXHJcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy8nXSlcclxuICB9XHJcblxyXG5cclxuXHJcbn0iXX0=