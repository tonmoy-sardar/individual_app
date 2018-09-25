"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var MinLengthDirective = /** @class */ (function () {
    function MinLengthDirective() {
    }
    MinLengthDirective_1 = MinLengthDirective;
    MinLengthDirective.prototype.validate = function (control) {
        return !control.value || control.value.length >= this.minlength ? null : { "minlength": true };
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MinLengthDirective.prototype, "minlength", void 0);
    MinLengthDirective = MinLengthDirective_1 = __decorate([
        core_1.Directive({
            selector: '[minlength]',
            providers: [{ provide: forms_1.NG_VALIDATORS, useExisting: MinLengthDirective_1, multi: true }]
        }),
        __metadata("design:paramtypes", [])
    ], MinLengthDirective);
    return MinLengthDirective;
    var MinLengthDirective_1;
}());
exports.MinLengthDirective = MinLengthDirective;
var MaxLengthDirective = /** @class */ (function () {
    function MaxLengthDirective() {
    }
    MaxLengthDirective_1 = MaxLengthDirective;
    MaxLengthDirective.prototype.validate = function (control) {
        return !control.value || control.value.length >= this.maxlength ? null : { "maxlength": true };
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MaxLengthDirective.prototype, "maxlength", void 0);
    MaxLengthDirective = MaxLengthDirective_1 = __decorate([
        core_1.Directive({
            selector: '[maxlength]',
            providers: [{ provide: forms_1.NG_VALIDATORS, useExisting: MaxLengthDirective_1, multi: true }]
        }),
        __metadata("design:paramtypes", [])
    ], MaxLengthDirective);
    return MaxLengthDirective;
    var MaxLengthDirective_1;
}());
exports.MaxLengthDirective = MaxLengthDirective;
var IsEmailDirective = /** @class */ (function () {
    function IsEmailDirective() {
    }
    IsEmailDirective_1 = IsEmailDirective;
    IsEmailDirective.prototype.validate = function (control) {
        var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        var valid = emailRegEx.test(control.value);
        return control.value < 1 || valid ? null : { 'email': true };
    };
    IsEmailDirective = IsEmailDirective_1 = __decorate([
        core_1.Directive({
            selector: '[email]',
            providers: [{ provide: forms_1.NG_VALIDATORS, useExisting: IsEmailDirective_1, multi: true }]
        }),
        __metadata("design:paramtypes", [])
    ], IsEmailDirective);
    return IsEmailDirective;
    var IsEmailDirective_1;
}());
exports.IsEmailDirective = IsEmailDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5wdXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWlEO0FBQ2pELHdDQUEyRTtBQU0zRTtJQUlJO0lBQXNCLENBQUM7MkJBSmQsa0JBQWtCO0lBTXBCLHFDQUFRLEdBQWYsVUFBZ0IsT0FBd0I7UUFDcEMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ25HLENBQUM7SUFOUTtRQUFSLFlBQUssRUFBRTs7eURBQW1CO0lBRmxCLGtCQUFrQjtRQUo5QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLGFBQWE7WUFDdkIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUscUJBQWEsRUFBRSxXQUFXLEVBQUUsb0JBQWtCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO1NBQ3RGLENBQUM7O09BQ1csa0JBQWtCLENBVTlCO0lBQUQseUJBQUM7O0NBQUEsQUFWRCxJQVVDO0FBVlksZ0RBQWtCO0FBZ0IvQjtJQUlJO0lBQXNCLENBQUM7MkJBSmQsa0JBQWtCO0lBTXBCLHFDQUFRLEdBQWYsVUFBZ0IsT0FBd0I7UUFDcEMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ25HLENBQUM7SUFOUTtRQUFSLFlBQUssRUFBRTs7eURBQW1CO0lBRmxCLGtCQUFrQjtRQUo5QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLGFBQWE7WUFDdkIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUscUJBQWEsRUFBRSxXQUFXLEVBQUUsb0JBQWtCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO1NBQ3RGLENBQUM7O09BQ1csa0JBQWtCLENBVTlCO0lBQUQseUJBQUM7O0NBQUEsQUFWRCxJQVVDO0FBVlksZ0RBQWtCO0FBZ0IvQjtJQUVJO0lBQXNCLENBQUM7eUJBRmQsZ0JBQWdCO0lBSWxCLG1DQUFRLEdBQWYsVUFBZ0IsT0FBd0I7UUFDcEMsSUFBSSxVQUFVLEdBQUcseUpBQXlKLENBQUM7UUFDM0ssSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUMvRCxDQUFDO0lBUlEsZ0JBQWdCO1FBSjVCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsU0FBUztZQUNuQixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxxQkFBYSxFQUFFLFdBQVcsRUFBRSxrQkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUM7U0FDcEYsQ0FBQzs7T0FDVyxnQkFBZ0IsQ0FVNUI7SUFBRCx1QkFBQzs7Q0FBQSxBQVZELElBVUM7QUFWWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5HX1ZBTElEQVRPUlMsIFZhbGlkYXRvciwgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1ttaW5sZW5ndGhdJyxcclxuICAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTWluTGVuZ3RoRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1dXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNaW5MZW5ndGhEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xyXG5cclxuICAgIEBJbnB1dCgpIG1pbmxlbmd0aDogc3RyaW5nO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgcHVibGljIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcclxuICAgICAgICByZXR1cm4gIWNvbnRyb2wudmFsdWUgfHwgY29udHJvbC52YWx1ZS5sZW5ndGggPj0gdGhpcy5taW5sZW5ndGggPyBudWxsIDogeyBcIm1pbmxlbmd0aFwiOiB0cnVlIH07XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW21heGxlbmd0aF0nLFxyXG4gICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBNYXhMZW5ndGhEaXJlY3RpdmUsIG11bHRpOiB0cnVlfV1cclxufSlcclxuZXhwb3J0IGNsYXNzIE1heExlbmd0aERpcmVjdGl2ZSBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XHJcblxyXG4gICAgQElucHV0KCkgbWF4bGVuZ3RoOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBwdWJsaWMgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0ge1xyXG4gICAgICAgIHJldHVybiAhY29udHJvbC52YWx1ZSB8fCBjb250cm9sLnZhbHVlLmxlbmd0aCA+PSB0aGlzLm1heGxlbmd0aCA/IG51bGwgOiB7IFwibWF4bGVuZ3RoXCI6IHRydWUgfTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbZW1haWxdJyxcclxuICAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogSXNFbWFpbERpcmVjdGl2ZSwgbXVsdGk6IHRydWV9XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgSXNFbWFpbERpcmVjdGl2ZSBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBwdWJsaWMgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0ge1xyXG4gICAgICAgIGxldCBlbWFpbFJlZ0V4ID0gL14oKFtePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC9pO1xyXG4gICAgICAgIGxldCB2YWxpZCA9IGVtYWlsUmVnRXgudGVzdChjb250cm9sLnZhbHVlKTtcclxuICAgICAgICByZXR1cm4gY29udHJvbC52YWx1ZSA8IDEgfHwgdmFsaWQgPyBudWxsIDogeydlbWFpbCc6IHRydWV9O1xyXG4gICAgfVxyXG5cclxufSJdfQ==