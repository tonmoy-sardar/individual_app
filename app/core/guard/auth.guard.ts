import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { getString, setString, getBoolean, setBoolean, clear } from "application-settings";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _routerExtensions: RouterExtensions) { }

    canActivate(): boolean {
        if (getBoolean('isLoggedin') || getBoolean('isSkipped')) {
            return true;
        }
        this._routerExtensions.navigate(["/login"], { clearHistory: true });
        return false;
    }
}