import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { StoreAppService } from "../../../core/services/store-app.service";
import * as Globals from '../../../core/globals';
import { Location } from '@angular/common';
import { getString, setString, getBoolean, setBoolean, clear } from "application-settings";
import { LoadingIndicator } from "nativescript-loading-indicator";
import { NotificationService } from "../../../core/services/notification.service";
const firebase = require("nativescript-plugin-firebase");
import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
registerElement('CardView', () => CardView);

@Component({
  selector: 'about-us',
  moduleId: module.id,
  templateUrl: `about-us.component.html`,
  styleUrls: [`about-us.component.css`]
})
export class StoreAppAboutUsComponent implements OnInit {
  app_id: string;
  app_details: any;
  visible_key: boolean;
  gallery_images: Array<any> = [];
  gallery_visible_key: boolean;

  user_id: string;
  rating: any = [1, 2, 3, 4, 5];
  rating_value: number;
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
  device_token: string;
  constructor(
    private route: ActivatedRoute,
    private storeAppService: StoreAppService,
    private location: Location,
    private notificationService: NotificationService
  ) {
    firebase.getCurrentPushToken().then((token: string) => {
      console.log(token);
      if (token != null) {
        setString('device_token', token)
      }
    });
  }

  ngOnInit() {

    this.storeAppService.pageStatus(true);
    var full_location = this.location.path().split('/');
    this.app_id = full_location[2].trim();
    this.user_id = getString('user_id');
    this.device_token = getString('device_token');
    this.getStoreAppAdoutDetails(this.app_id)
    this.getAppRatingValue();
    this.updateDeviceToken();
  }

  updateDeviceToken() {
    var data = {
      customer_device_token: this.device_token
    }
    this.notificationService.updateDeviceToken(this.user_id, data).subscribe(
      res => {
        //console.log(res)
      },
      error => {
        console.log(error)
      }
    )
  }

  getStoreAppAdoutDetails(id) {
    this.loader.show(this.lodaing_options);
    this.storeAppService.getStoreAppAdoutDetails(id).subscribe(
      res => {
        this.app_details = res;
        if (this.app_details.app_imgs.length > 0) {
          this.app_details.app_imgs.forEach(x => {
            var data = {
              url: Globals.img_base_url + x.app_img
            }
            this.gallery_images.push(data)
          })
        }
        this.visible_key = true
        // console.log(res)
        this.loader.hide();
      },
      error => {
        this.loader.hide();
        // console.log(error)
      }
    )
  }

  toggleGallery() {
    this.gallery_visible_key = !this.gallery_visible_key;
  }


  rateApp(val) {
    var data = {
      app_master: this.app_id,
      customer: this.user_id,
      rating: val
    }
    this.storeAppService.appRate(data).subscribe(
      res => {
        // console.log(res)
        this.rating_value = val
      },
      error => {
        // console.log(error)
      }
    )
  }

  getAppRatingValue() {
    this.storeAppService.getAppRating(this.user_id, this.app_id).subscribe(
      (res: any[]) => {
        // console.log(res)
        if (res.length > 0) {
          this.rating_value = res[0]['rating'];
        }
      },
      error => {
        // console.log(error)
      }
    )
  }
}