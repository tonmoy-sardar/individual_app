import { Component, ViewChild, ElementRef, NgZone, OnInit } from "@angular/core";
var orientation = require('nativescript-orientation');
import * as application from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";
const firebase = require("nativescript-plugin-firebase");
import { NotificationService } from "./core/services/notification.service";
import { Button } from "ui/button";
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";
import * as Connectivity from "tns-core-modules/connectivity";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent {
    @ViewChild("button") button: ElementRef;
    private feedback: Feedback;
    public connectionType: string;
    is_success: boolean;
    constructor(
        private router: RouterExtensions,
        private notificationService: NotificationService,
        private zone: NgZone
    ) {
        orientation.setOrientation("portrait");
        application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
            if (this.router.canGoBack()) {
                args.cancel = true;
                // this.router.back();
            } else {
                args.cancel = false;
            }
        });

        // push notification
        var $this = this;
        firebase.init({
            onPushTokenReceivedCallback: function (token) {
                // console.log("Firebase push token: " + token);
            },
            onMessageReceivedCallback: function (message) {
                let el: Button = $this.button.nativeElement;
                el.notify({ eventName: "tap", object: el })
            },
            persist: false
        }).then(
            instance => {
                //console.log("firebase.init done");
            },
            error => {
                //console.log(`firebase.init error: ${error}`);
            }
        );
        this.feedback = new Feedback();
    }

    ngOnInit() {
        this.connectionType = this.connectionToString(Connectivity.getConnectionType());
        Connectivity.startMonitoring(connectionType => {
            this.zone.run(() => {
                this.connectionType = this.connectionToString(connectionType);
                if (this.connectionType == "0" && !this.is_success) {
                    this.is_success = true;
                    this.feedback.error({
                        title: "No Connection!",
                        backgroundColor: new Color("red"),
                        titleColor: new Color("black"),
                        position: FeedbackPosition.Bottom,
                        type: FeedbackType.Custom
                    });                    
                }
                else if (this.connectionType == "1" && this.is_success) {
                    this.is_success = false;
                    this.feedback.success({
                        title: 'Network Connected',
                        backgroundColor: new Color("green"),
                        titleColor: new Color("black"),
                        position: FeedbackPosition.Bottom,
                        type: FeedbackType.Custom
                    });
                }

            });
        });
    }

    connectionToString(connectionType: number): string {
        switch (connectionType) {
            case Connectivity.connectionType.none:
                return "0";
            case Connectivity.connectionType.wifi:
                return "1";
            case Connectivity.connectionType.mobile:
                return "1";
            default:
                return "0";
        }
    }

    pushN() {
        this.notificationService.badgeCountStatus(true);
    }


}
