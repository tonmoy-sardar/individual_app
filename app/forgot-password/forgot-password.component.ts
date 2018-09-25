import { Component, ViewContainerRef, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from "../core/services/login.service";
import { getString, setString, getBoolean, setBoolean, clear } from "application-settings";
import { RouterExtensions } from "nativescript-angular/router";
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";
import { LoadingIndicator } from "nativescript-loading-indicator";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import * as Globals from '../core/globals';
import { StoreAppService } from "../core/services/store-app.service";

@Component({
  selector: "forgot-password",
  moduleId: module.id,
  templateUrl: "./forgot-password.component.html",
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  app_details: any;
  visible_key: boolean;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  showOtpSection = false;
  newPwdSection = false;
  contact_no;
  otp_check;
  private feedback: Feedback;
  loader = new LoadingIndicator();
  otp;
  lodaing_options = {
    message: 'Loading...',
    progress: 0.65,
    android: {
      indeterminate: true,
      cancelable: false,
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
  options = {
    context: {},
    fullscreen: false,
    viewContainerRef: this.vcRef
  };

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private modal: ModalDialogService,
    private vcRef: ViewContainerRef,
    private storeAppService: StoreAppService,
  ) {
    this.page.actionBarHidden = true;
    this.feedback = new Feedback();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      contact_no: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      app_store_flag: [1],
      app_id: [Globals.staticAppID],
    });

    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      conf_password: ['', Validators.required]
    });

    this.getStoreAppMinDetails(Globals.staticAppID);
  }

  getStoreAppMinDetails(id) {
    this.storeAppService.getStoreAppMinDetails(id).subscribe(
      res => {
        this.app_details = res;
        this.visible_key = true
      },
      error => {
        console.log(error)
      }
    )
  }
  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && (form.get(field).dirty || form.get(field).touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field).invalid && (form.get(field).dirty || form.get(field).touched),
      'is-valid': form.get(field).valid && (form.get(field).dirty || form.get(field).touched)
    };
  } 


  customerForgotPasswordOtp() {

    if (this.form.valid) {
      this.loader.show(this.lodaing_options);
      this.contact_no = this.form.value.contact_no;
      this.loginService.customerForgetPasswordOtp(this.form.value).subscribe(
        res => {
          this.loader.hide();
          // console.log(res)
          this.otp = res.otp
          this.showOtpSection = true;
        },
        error => {
          this.loader.hide();
          // console.log(error)
          this.feedback.error({
            title: error.error.msg,
            backgroundColor: new Color("red"),
            titleColor: new Color("black"),
            position: FeedbackPosition.Bottom,
            type: FeedbackType.Custom
          });
        }
      )
    }
    else {
      this.markFormGroupTouched(this.form)
    }
  }

  resendOtp() {
    this.loader.show(this.lodaing_options);

    var data = {
      contact_no: this.contact_no,
      app_store_flag: 1,
      app_id: Globals.staticAppID,
    }
    this.loginService.customerForgetPasswordOtp(data).subscribe(
      res => {
        this.loader.hide();
        // console.log(res)
        this.otp = res.otp
        this.showOtpSection = true;
      },
      error => {
        this.loader.hide();
        // console.log(error)
        this.feedback.error({
          title: error.error.msg,
          backgroundColor: new Color("red"),
          titleColor: new Color("black"),
          position: FeedbackPosition.Bottom,
          type: FeedbackType.Custom
        });
      }
    )
  }

  submitOtp() {
    if (this.otp == this.otpForm.value.otp) {
      this.newPwdSection = true;
      this.otp_check = 1;
    }
    else {
      this.feedback.error({
        title: 'Please Enter Valid OTP',
        backgroundColor: new Color("red"),
        titleColor: new Color("black"),
        position: FeedbackPosition.Bottom,
        type: FeedbackType.Custom
      });

    }
  }

  submitNewPwd() {
    if (this.passwordForm.valid) {
      if (this.passwordForm.value.conf_password != this.passwordForm.value.password) {
        this.feedback.error({
          title: 'Password & Confirm Password are not same',
          backgroundColor: new Color("red"),
          titleColor: new Color("black"),
          position: FeedbackPosition.Bottom,
          type: FeedbackType.Custom
        });
      }
      else {
        this.loader.show(this.lodaing_options);
        var data = {
          contact_no: this.contact_no,
          otp_check: this.otp_check,
          password: this.passwordForm.value.password,
          app_store_flag: 1,
          app_id: Globals.staticAppID
        }
        this.loginService.userForgetPasswordUpdate(data).subscribe(
          res => {
            this.loader.hide();
            this.feedback.success({
              title: 'Password has been successfully changed. ',
              backgroundColor: new Color("green"),
              titleColor: new Color("black"),
              position: FeedbackPosition.Bottom,
              type: FeedbackType.Custom
            });
            this.router.navigate(['/login'])
          },
          error => {
            this.loader.hide();
            // console.log(error)
            this.feedback.error({
              title: error.error.msg,
              backgroundColor: new Color("red"),
              titleColor: new Color("black"),
              position: FeedbackPosition.Bottom,
              type: FeedbackType.Custom
            });
          }
        )

      }

    }
    else {
      this.markFormGroupTouched(this.form)
    }

  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

}