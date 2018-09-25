import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { StoreAppService } from "../../../core/services/store-app.service";
import * as TNSPhone from 'nativescript-phone';
import { Router } from "@angular/router";
import { LoadingIndicator } from "nativescript-loading-indicator";
var OpenUrl = require("nativescript-openurl");
import { getString, setString, getBoolean, setBoolean, clear } from "application-settings";
import { NotificationService } from "../../../core/services/notification.service";


@Component({
    selector: 'contact-us',
    moduleId: module.id,
    templateUrl: `contact-us.component.html`,
    styleUrls: [`contact-us.component.css`]
})
export class StoreAppContactUsComponent implements OnInit {
    app_id: string;
    app_details: any;
    visible_key: boolean;
    loader = new LoadingIndicator();
    social_media_links: any = [];

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
    chat_unread_length: number = 0;
    badgeCountStatus: boolean;
    user_id: string;
    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private storeAppService: StoreAppService,
        private router: Router,
        private notificationService: NotificationService,
    ) {
        notificationService.getBadgeCountStatus.subscribe(status => this.changebadgeCountStatus(status))
    }

    private changebadgeCountStatus(status: boolean): void {
        this.badgeCountStatus = status;
        if (this.badgeCountStatus == true) {
            this.getChatMembersDetails();
        }
    }
    ngOnInit() {
        this.storeAppService.pageStatus(false);
        this.loader.show(this.lodaing_options);
        var full_location = this.location.path().split('/');
        this.app_id = full_location[2].trim();
        this.user_id = getString('user_id');
        this.getStoreAppContactDetails(this.app_id);
        this.getSocialMediaListByApp(this.app_id);
        this.getChatMembersDetails();
    }

    getChatMembersDetails() {
        this.storeAppService.getChatUnreadMessageCount(this.user_id, this.app_id).subscribe(
            res => {

                this.chat_unread_length = res['unread_message_count'];

            },
            error => {
                // console.log(error)
            }
        )
    }


    getStoreAppContactDetails(id) {
        this.storeAppService.getStoreAppContactDetails(id).subscribe(
            res => {
                this.app_details = res;
                this.visible_key = true;
                // console.log(res)
                this.loader.hide();
            },
            error => {
                this.loader.hide();
                // console.log(error)
            }
        )
    }

    getSocialMediaListByApp(id) {
        this.storeAppService.getSocialMediaListByApp(id).subscribe(
            res => {
                this.social_media_links = res;
                // console.log(res);
            },
            error => {
                // console.log(error)
            }
        )
    }

    massage() {
        this.router.navigate(['/store-app/', this.app_id, 'messenger'])
    }

    call(mobile) {
        TNSPhone.dial(mobile.toString(), true);
    }


    launch(url) {
        OpenUrl(url);
    }
}