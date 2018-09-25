"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("nativescript-angular/common");
var forgot_password_routing_1 = require("./forgot-password.routing");
var forgot_password_component_1 = require("./forgot-password.component");
var core_module_1 = require("../core/core.module");
var ForgotPasswordModule = /** @class */ (function () {
    function ForgotPasswordModule() {
    }
    ForgotPasswordModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.NativeScriptCommonModule,
                forgot_password_routing_1.ForgotPasswordRoutingModule,
                core_module_1.CoreModule
            ],
            declarations: [
                forgot_password_component_1.ForgotPasswordComponent
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], ForgotPasswordModule);
    return ForgotPasswordModule;
}());
exports.ForgotPasswordModule = ForgotPasswordModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290LXBhc3N3b3JkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcmdvdC1wYXNzd29yZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0Qsc0RBQXVFO0FBRXZFLHFFQUF3RTtBQUN4RSx5RUFBc0U7QUFFdEUsbURBQWlEO0FBZWpEO0lBQUE7SUFBb0MsQ0FBQztJQUF4QixvQkFBb0I7UUFiaEMsZUFBUSxDQUFDO1lBQ04sT0FBTyxFQUFFO2dCQUNMLGlDQUF3QjtnQkFDeEIscURBQTJCO2dCQUMzQix3QkFBVTthQUNiO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLG1EQUF1QjthQUMxQjtZQUNELE9BQU8sRUFBRTtnQkFDTCx1QkFBZ0I7YUFDbkI7U0FDSixDQUFDO09BQ1csb0JBQW9CLENBQUk7SUFBRCwyQkFBQztDQUFBLEFBQXJDLElBQXFDO0FBQXhCLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Q29tbW9uTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2NvbW1vblwiO1xyXG5cclxuaW1wb3J0IHsgRm9yZ290UGFzc3dvcmRSb3V0aW5nTW9kdWxlIH0gZnJvbSBcIi4vZm9yZ290LXBhc3N3b3JkLnJvdXRpbmdcIjtcclxuaW1wb3J0IHsgRm9yZ290UGFzc3dvcmRDb21wb25lbnQgfSBmcm9tIFwiLi9mb3Jnb3QtcGFzc3dvcmQuY29tcG9uZW50XCI7XHJcblxyXG5pbXBvcnQgeyBDb3JlTW9kdWxlIH0gZnJvbSBcIi4uL2NvcmUvY29yZS5tb2R1bGVcIjtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgTmF0aXZlU2NyaXB0Q29tbW9uTW9kdWxlLFxyXG4gICAgICAgIEZvcmdvdFBhc3N3b3JkUm91dGluZ01vZHVsZSxcclxuICAgICAgICBDb3JlTW9kdWxlXHJcbiAgICBdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICAgICAgRm9yZ290UGFzc3dvcmRDb21wb25lbnRcclxuICAgIF0sXHJcbiAgICBzY2hlbWFzOiBbXHJcbiAgICAgICAgTk9fRVJST1JTX1NDSEVNQVxyXG4gICAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRm9yZ290UGFzc3dvcmRNb2R1bGUgeyB9XHJcbiJdfQ==