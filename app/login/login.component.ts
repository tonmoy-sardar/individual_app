import { Component,ViewContainerRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
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
  selector: "login",
  moduleId: module.id,
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  app_details: any;
  visible_key: boolean;
  private feedback: Feedback;
  loader = new LoadingIndicator();
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
      username: ['', Validators.required],
      password: ['', Validators.required],
      app_store_flag: [1],
      app_id: [Globals.staticAppID],
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
  isFieldValid(field: string) {
    return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched),
      'is-valid': this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched)
    };
  }



  signIn() {

    if (this.form.valid) {
      this.loader.show(this.lodaing_options);
      this.loginService.login(this.form.value).subscribe(
        res => {
          console.log(res)
          clear();
          setBoolean("isLoggedin", true)

          if (res.email != "") {
            setString('email', res.email)
          }

          setString('contact_no', res.contact_no)
          setString('user_id', res.user_id.toString())
          this.loader.hide();
          this.router.navigate(['/'])
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

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  skip() {
    setBoolean("isSkipped", true)
    this.router.navigate(['/'])
  }


  forgotPassword() {
    prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for Shyam Future Store to reset your password.",
      inputType: "email",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {

      }
    });
  }
  


}