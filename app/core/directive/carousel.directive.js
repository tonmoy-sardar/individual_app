"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var enums_1 = require("ui/enums");
var image_1 = require("ui/image");
var stack_layout_1 = require("ui/layouts/stack-layout");
var grid_layout_1 = require("ui/layouts/grid-layout");
var label_1 = require("ui/label");
var gestures_1 = require("ui/gestures");
var image_source_1 = require("image-source");
var image_source_2 = require("image-source");
var CarouselDirective = /** @class */ (function () {
    function CarouselDirective(elem) {
        this.elem = elem;
        this.totalItems = 0;
        this.arrowType = CarouselArrowTypes.NORMAL;
        // Private control attributes
        this.direction = null;
        this.currentImage = 0;
        this.movingImages = false;
        this.indexMoveLeft = null;
        this.indexMoveRight = null;
        this.indexMoveCenter = null;
        this.container = elem.nativeElement;
    }
    CarouselDirective_1 = CarouselDirective;
    CarouselDirective.prototype.ngAfterViewInit = function () {
        this.initOptions();
        this.initContainer();
        this.initImagesLayout();
        this.initSlides();
        this.initControls();
        this.initAutoPlay();
    };
    /**
     * Get and set options from directive
     */
    CarouselDirective.prototype.initOptions = function () {
        // Animation duration (in ms)
        if (this.carouselAnimationSpeed && CarouselDirective_1.isNumeric(this.carouselAnimationSpeed)) {
            this.carouselAnimationSpeed = +this.carouselAnimationSpeed;
        }
        else {
            this.carouselAnimationSpeed = CarouselDirective_1.animationSpeedDefault;
        }
        // Autoplay (in ms) + animation duration
        if (this.carouselSpeed && CarouselDirective_1.isNumeric(this.carouselSpeed)) {
            this.carouselSpeed = +(this.carouselSpeed);
        }
        else {
            this.carouselSpeed = CarouselDirective_1.autoPlaySpeedDefault;
        }
        // Set arrow type
        if (this.carouselArrows) {
            switch (this.carouselArrows) {
                case 'none':
                    this.arrowType = CarouselArrowTypes.NONE;
                    break;
                case 'small':
                    this.arrowType = CarouselArrowTypes.SMALL;
                    break;
                case 'normal':
                    this.arrowType = CarouselArrowTypes.NORMAL;
                    break;
                case 'bold':
                    this.arrowType = CarouselArrowTypes.BOLD;
                    break;
                case 'narrow':
                    this.arrowType = CarouselArrowTypes.NARROW;
                    break;
            }
        }
    };
    /**
     * Init carousel layout
     */
    CarouselDirective.prototype.initContainer = function () {
        this.container.horizontalAlignment = "center";
        this.container.addRow(new grid_layout_1.ItemSpec(1, "auto"));
        this.container.addColumn(new grid_layout_1.ItemSpec(1, "star"));
        this.container.addColumn(new grid_layout_1.ItemSpec(1, "star"));
    };
    /**
     * Init sliders layout
     */
    CarouselDirective.prototype.initImagesLayout = function () {
        this.totalItems = this.carousel.length;
        this.carouselSlides = new grid_layout_1.GridLayout();
        grid_layout_1.GridLayout.setColumnSpan(this.carouselSlides, 2);
        this.container.addChild(this.carouselSlides);
    };
    /**
     * Init carousel sliders provided in "carousel" directive attribute
     */
    CarouselDirective.prototype.initSlides = function () {
        var _this = this;
        this.carousel.forEach(function (slide, i) {
            var gridLayout = new grid_layout_1.GridLayout();
            gridLayout.addRow(new grid_layout_1.ItemSpec(1, "auto"));
            gridLayout.visibility = i == 0 ? "visible" : "collapse";
            if (slide.url) {
                var image = CarouselDirective_1.generateImageSliderFromUrl(slide.url);
                gridLayout.addChild(image);
            }
            if (slide.file && slide.file.indexOf('res://') !== 0) {
                var image = CarouselDirective_1.generateImageSliderFromFile(slide.file);
                gridLayout.addChild(image);
            }
            if (slide.file && slide.file.indexOf('res://') === 0) {
                var image = CarouselDirective_1.generateImageSliderFromResource(slide.file);
                gridLayout.addChild(image);
            }
            if (slide.title) {
                var title = CarouselDirective_1.generateTitleSlider(slide.title);
                if (_this.carouselLabelOverlay) {
                    gridLayout.addRow(new grid_layout_1.ItemSpec(1, "auto"));
                    grid_layout_1.GridLayout.setRow(title, 1);
                }
                gridLayout.addChild(title);
            }
            _this.carouselSlides.addChild(gridLayout);
        });
    };
    /**
     * Load images from URL
     * @param src
     * @returns {Image}
     */
    CarouselDirective.generateImageSliderFromUrl = function (src) {
        var image = new image_1.Image();
        image.src = src;
        image.className = "slider-image";
        return image;
    };
    /**
     * Load images from file
     * @param path
     * @returns {Image}
     */
    CarouselDirective.generateImageSliderFromFile = function (path) {
        var image = new image_1.Image();
        image.imageSource = image_source_1.fromFile(path);
        image.className = "slider-image";
        return image;
    };
    /**
     * Load images from file
     * @param path
     * @returns {Image}
     */
    CarouselDirective.generateImageSliderFromResource = function (path) {
        var image = new image_1.Image();
        var pathRaw = path.replace('res://', '');
        image.imageSource = image_source_2.fromResource(pathRaw);
        image.className = "slider-image";
        return image;
    };
    /**
     * Generate title slider element
     * @param title
     * @returns {Label}
     */
    CarouselDirective.generateTitleSlider = function (title) {
        var label = new label_1.Label();
        label.text = title;
        label.textWrap = true;
        label.className = 'slider-title';
        return label;
    };
    /**
     * Init carousel controls
     */
    CarouselDirective.prototype.initControls = function () {
        var _this = this;
        if (this.totalItems > 1) {
            // Get Arrow type
            var arrowType = this.getArrowType();
            // Left arrow label
            var lLabel = new label_1.Label();
            lLabel.text = String.fromCharCode(parseInt(arrowType.l, 16));
            // Left arrow layout
            var lStackLayout = new stack_layout_1.StackLayout();
            lStackLayout.addChild(lLabel);
            lStackLayout.horizontalAlignment = "left";
            lStackLayout.on(gestures_1.GestureTypes.tap, function () {
                _this.stopStartAutoplay();
                _this.swipe(CarouselDirections.DIRECTION_LEFT);
            });
            lStackLayout.className = 'arrow arrow-left';
            grid_layout_1.GridLayout.setColumn(lStackLayout, 0);
            this.container.addChild(lStackLayout);
            // Right arrow label
            var rLabel = new label_1.Label();
            rLabel.text = String.fromCharCode(parseInt(arrowType.r, 16));
            // Left arrow layout
            var rStackLayout = new stack_layout_1.StackLayout();
            rStackLayout.addChild(rLabel);
            rStackLayout.horizontalAlignment = "right";
            rStackLayout.on(gestures_1.GestureTypes.tap, function () {
                _this.stopStartAutoplay();
                _this.swipe(CarouselDirections.DIRECTION_RIGHT);
            });
            rStackLayout.className = 'arrow arrow-right';
            grid_layout_1.GridLayout.setColumn(rStackLayout, 1);
            this.container.addChild(rStackLayout);
        }
    };
    /**
     * Init caroussel autoplay
     */
    CarouselDirective.prototype.initAutoPlay = function () {
        var _this = this;
        if (this.carouselSpeed && CarouselDirective_1.isNumeric(this.carouselSpeed)) {
            clearInterval(this.autoPlayIntervalId);
            this.autoPlayIntervalId = setInterval(function () {
                _this.swipe(CarouselDirections.DIRECTION_RIGHT);
            }, this.carouselSpeed + this.carouselAnimationSpeed);
        }
    };
    /**
     * Stop on gesture detected, resume after 4 seconds
     */
    CarouselDirective.prototype.stopStartAutoplay = function () {
        var _this = this;
        if (this.autoPlayIntervalId) {
            clearTimeout(this.autoPlayTimeoutId);
            clearInterval(this.autoPlayIntervalId);
            this.autoPlayTimeoutId = setTimeout(function () {
                _this.swipe(CarouselDirections.DIRECTION_RIGHT);
                _this.initAutoPlay();
            }, 4000);
        }
    };
    /**
     * Animate right to left or left to right
     * @param direction
     * @returns {boolean}
     */
    CarouselDirective.prototype.swipe = function (direction) {
        var _this = this;
        // Do nothing, hay solo una imagen...
        if (this.totalItems < 2 || this.movingImages) {
            return false;
        }
        // Animate slides
        this.direction = direction;
        this.movingImages = true;
        this.setDirectionValues();
        this.animateSlides();
        // Reset all after animation
        setTimeout(function () { return _this.resetAnimationValues(); }, this.carouselAnimationSpeed);
    };
    /**
     * Animate slides
     */
    CarouselDirective.prototype.animateSlides = function () {
        for (var i = 0; i < this.carouselSlides.getChildrenCount(); i++) {
            // Get view
            var view = this.carouselSlides.getChildAt(i);
            // Get element width + image visibility
            var elementWidth = this.elem.nativeElement.getActualSize().width;
            view.visibility = [this.indexMoveCenter, this.indexMoveLeft, this.indexMoveRight].indexOf(i) > -1 ? "visible" : "collapse";
            // Perfrom animation
            this.checkCL(view, i, elementWidth);
            this.checkCR(view, i, elementWidth);
            this.checkRC(view, i, elementWidth);
            this.checkLC(view, i, elementWidth);
        }
    };
    /**
     * Move image center -> left
     * @param view
     * @param index
     * @param elementWidth
     */
    CarouselDirective.prototype.checkCL = function (view, index, elementWidth) {
        if (this.indexMoveLeft == index) {
            view.translateX = 0;
            view.animate({
                translate: { x: elementWidth, y: 0 },
                duration: this.carouselAnimationSpeed,
                curve: enums_1.AnimationCurve.easeIn
            });
        }
    };
    /**
     * Move image right -> center
     * @param view
     * @param index
     * @param elementWidth
     */
    CarouselDirective.prototype.checkRC = function (view, index, elementWidth) {
        if (this.indexMoveCenter == index && this.direction == CarouselDirections.DIRECTION_LEFT) {
            view.translateX = -elementWidth;
            view.animate({
                translate: { x: 0, y: 0 },
                duration: this.carouselAnimationSpeed,
                curve: enums_1.AnimationCurve.easeOut
            });
        }
    };
    /**
     * Move image center -> right
     * @param view
     * @param index
     * @param elementWidth
     */
    CarouselDirective.prototype.checkCR = function (view, index, elementWidth) {
        if (this.indexMoveRight == index) {
            view.translateX = 0;
            view.animate({
                translate: { x: -elementWidth, y: 0 },
                duration: this.carouselAnimationSpeed,
                curve: enums_1.AnimationCurve.easeIn
            });
        }
    };
    /**
     * Move image left -> center
     * @param view
     * @param index
     * @param elementWidth
     */
    CarouselDirective.prototype.checkLC = function (view, index, elementWidth) {
        if (this.indexMoveCenter == index && this.direction == CarouselDirections.DIRECTION_RIGHT) {
            view.translateX = elementWidth;
            view.animate({
                translate: { x: 0, y: 0 },
                duration: this.carouselAnimationSpeed,
                curve: enums_1.AnimationCurve.easeOut
            });
        }
    };
    /**
     * Set values to perform the animation
     */
    CarouselDirective.prototype.setDirectionValues = function () {
        switch (this.direction) {
            // right to left
            case CarouselDirections.DIRECTION_LEFT:
                this.indexMoveLeft = this.currentImage;
                this.currentImage = ((this.currentImage == 0 ? this.totalItems : this.currentImage) - 1) % this.totalItems;
                this.indexMoveCenter = this.currentImage;
                break;
            // left to right
            case CarouselDirections.DIRECTION_RIGHT:
                this.indexMoveRight = this.currentImage;
                this.currentImage = (this.currentImage + 1) % this.totalItems;
                this.indexMoveCenter = this.currentImage;
                break;
        }
    };
    /**
     * Reset values after animation
     */
    CarouselDirective.prototype.resetAnimationValues = function () {
        this.indexMoveLeft = null;
        this.indexMoveRight = null;
        this.indexMoveCenter = null;
        this.movingImages = false;
    };
    /**
     * Get arrow type to be displayed in frontend
     * @returns {{l: string, r: string}}
     */
    CarouselDirective.prototype.getArrowType = function () {
        var ret = { l: '', r: '' };
        switch (this.arrowType) {
            case CarouselArrowTypes.NONE:
                ret.l = '';
                ret.r = '';
                break;
            case CarouselArrowTypes.SMALL:
                ret.l = '2039';
                ret.r = '203A';
                break;
            default:
            case CarouselArrowTypes.NORMAL:
                ret.l = '276E';
                ret.r = '276F';
                break;
            case CarouselArrowTypes.BOLD:
                ret.l = '2770';
                ret.r = '2771';
                break;
            case CarouselArrowTypes.NARROW:
                ret.l = '2329';
                ret.r = '232A';
                break;
        }
        return ret;
    };
    /**
     * Check if numeric value
     * @param value
     * @returns {boolean}
     */
    CarouselDirective.isNumeric = function (value) {
        return !isNaN(value - parseFloat(value));
    };
    CarouselDirective.animationSpeedDefault = 400; // in ms
    CarouselDirective.autoPlaySpeedDefault = 0; // in ms
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CarouselDirective.prototype, "carousel", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], CarouselDirective.prototype, "carouselSpeed", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CarouselDirective.prototype, "carouselArrows", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CarouselDirective.prototype, "carouselLabelOverlay", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], CarouselDirective.prototype, "carouselAnimationSpeed", void 0);
    CarouselDirective = CarouselDirective_1 = __decorate([
        core_1.Directive({ selector: '[carousel]' }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], CarouselDirective);
    return CarouselDirective;
    var CarouselDirective_1;
}());
exports.CarouselDirective = CarouselDirective;
var CarouselArrowTypes;
(function (CarouselArrowTypes) {
    CarouselArrowTypes[CarouselArrowTypes["NONE"] = 0] = "NONE";
    CarouselArrowTypes[CarouselArrowTypes["SMALL"] = 1] = "SMALL";
    CarouselArrowTypes[CarouselArrowTypes["NARROW"] = 2] = "NARROW";
    CarouselArrowTypes[CarouselArrowTypes["NORMAL"] = 3] = "NORMAL";
    CarouselArrowTypes[CarouselArrowTypes["BOLD"] = 4] = "BOLD";
})(CarouselArrowTypes || (CarouselArrowTypes = {}));
var CarouselDirections;
(function (CarouselDirections) {
    CarouselDirections[CarouselDirections["DIRECTION_LEFT"] = 0] = "DIRECTION_LEFT";
    CarouselDirections[CarouselDirections["DIRECTION_RIGHT"] = 1] = "DIRECTION_RIGHT";
})(CarouselDirections || (CarouselDirections = {}));
var CarouselSlide = /** @class */ (function () {
    function CarouselSlide() {
    }
    return CarouselSlide;
}());
exports.CarouselSlide = CarouselSlide;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2Fyb3VzZWwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTBFO0FBQzFFLGtDQUF3QztBQUN4QyxrQ0FBK0I7QUFDL0Isd0RBQW9EO0FBQ3BELHNEQUE0RDtBQUc1RCxrQ0FBK0I7QUFDL0Isd0NBQXlDO0FBR3pDLDZDQUFzQztBQUN0Qyw2Q0FBMEM7QUFHMUM7SUEyQkksMkJBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7UUFwQjVCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFHdkIsY0FBUyxHQUFXLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztRQUV0RCw2QkFBNkI7UUFDckIsY0FBUyxHQUF1QixJQUFJLENBQUM7UUFDckMsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFDekIsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsa0JBQWEsR0FBVyxJQUFJLENBQUM7UUFDN0IsbUJBQWMsR0FBVyxJQUFJLENBQUM7UUFDOUIsb0JBQWUsR0FBVyxJQUFJLENBQUM7UUFVbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQ3hDLENBQUM7MEJBN0JRLGlCQUFpQjtJQStCMUIsMkNBQWUsR0FBZjtRQUNJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOztPQUVHO0lBQ0ssdUNBQVcsR0FBbkI7UUFFSSw2QkFBNkI7UUFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixJQUFJLG1C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SyxDQUFBO0lBQ0wsK0RBQU0sQ0FBQTtJQUNOLCtEQUFNLENBQUE7SUFDTiwyREFBSSxDQUFBO0FBQ1IsQ0FBQyxFQU5JLGtCQUFrQixLQUFsQixrQkFBa0IsUUFNdEI7QUFFRCxJQUFLLGtCQUdKO0FBSEQsV0FBSyxrQkFBa0I7SUFDbkIsK0VBQWMsQ0FBQTtJQUNkLGlGQUFlLENBQUE7QUFDbkIsQ0FBQyxFQUhJLGtCQUFrQixLQUFsQixrQkFBa0IsUUFHdEI7QUFFRDtJQUFBO0lBSUEsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7QW5pbWF0aW9uQ3VydmV9IGZyb20gXCJ1aS9lbnVtc1wiO1xyXG5pbXBvcnQge0ltYWdlfSBmcm9tIFwidWkvaW1hZ2VcIjtcclxuaW1wb3J0IHtTdGFja0xheW91dH0gZnJvbSBcInVpL2xheW91dHMvc3RhY2stbGF5b3V0XCI7XHJcbmltcG9ydCB7R3JpZExheW91dCwgSXRlbVNwZWN9IGZyb20gXCJ1aS9sYXlvdXRzL2dyaWQtbGF5b3V0XCI7XHJcbmltcG9ydCB7R3JpZFVuaXRUeXBlfSBmcm9tIFwidWkvbGF5b3V0cy9ncmlkLWxheW91dFwiO1xyXG5pbXBvcnQge0hvcml6b250YWxBbGlnbm1lbnR9IGZyb20gXCJ1aS9lbnVtc1wiO1xyXG5pbXBvcnQge0xhYmVsfSBmcm9tIFwidWkvbGFiZWxcIjtcclxuaW1wb3J0IHtHZXN0dXJlVHlwZXN9IGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xyXG5pbXBvcnQge1ZpZXd9IGZyb20gXCJ1aS9jb3JlL3ZpZXdcIjtcclxuaW1wb3J0IHtWaXNpYmlsaXR5fSBmcm9tIFwidWkvZW51bXNcIjtcclxuaW1wb3J0IHtmcm9tRmlsZX0gZnJvbSBcImltYWdlLXNvdXJjZVwiO1xyXG5pbXBvcnQge2Zyb21SZXNvdXJjZX0gZnJvbSBcImltYWdlLXNvdXJjZVwiO1xyXG5cclxuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbY2Fyb3VzZWxdJ30pXHJcbmV4cG9ydCBjbGFzcyBDYXJvdXNlbERpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFuaW1hdGlvblNwZWVkRGVmYXVsdDogbnVtYmVyID0gNDAwOyAvLyBpbiBtc1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXV0b1BsYXlTcGVlZERlZmF1bHQ6IG51bWJlciA9IDA7IC8vIGluIG1zXHJcblxyXG4gICAgcHJpdmF0ZSBjb250YWluZXI6IEdyaWRMYXlvdXQ7XHJcbiAgICBwcml2YXRlIGNhcm91c2VsU2xpZGVzOiBHcmlkTGF5b3V0O1xyXG4gICAgcHJpdmF0ZSB0b3RhbEl0ZW1zOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBhdXRvUGxheUludGVydmFsSWQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgYXV0b1BsYXlUaW1lb3V0SWQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgYXJyb3dUeXBlOiBudW1iZXIgPSBDYXJvdXNlbEFycm93VHlwZXMuTk9STUFMO1xyXG5cclxuICAgIC8vIFByaXZhdGUgY29udHJvbCBhdHRyaWJ1dGVzXHJcbiAgICBwcml2YXRlIGRpcmVjdGlvbjogQ2Fyb3VzZWxEaXJlY3Rpb25zID0gbnVsbDtcclxuICAgIHByaXZhdGUgY3VycmVudEltYWdlOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBtb3ZpbmdJbWFnZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgaW5kZXhNb3ZlTGVmdDogbnVtYmVyID0gbnVsbDtcclxuICAgIHByaXZhdGUgaW5kZXhNb3ZlUmlnaHQ6IG51bWJlciA9IG51bGw7XHJcbiAgICBwcml2YXRlIGluZGV4TW92ZUNlbnRlcjogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgICAvLyBPcHRpb25zXHJcbiAgICBASW5wdXQoKSBjYXJvdXNlbDogYW55O1xyXG4gICAgQElucHV0KCkgY2Fyb3VzZWxTcGVlZDogbnVtYmVyOyAvLyBhdXRvcGxheSBzcGVlZCAobXMpXHJcbiAgICBASW5wdXQoKSBjYXJvdXNlbEFycm93czogc3RyaW5nOyAvLyBhcnJvd3MgdHlwZVxyXG4gICAgQElucHV0KCkgY2Fyb3VzZWxMYWJlbE92ZXJsYXk6IGJvb2xlYW47IC8vIHRpdGxlIG92ZXIgaW1hZ2UgKGJvb2wpXHJcbiAgICBASW5wdXQoKSBjYXJvdXNlbEFuaW1hdGlvblNwZWVkOiBudW1iZXI7IC8vIGFuaW1hdGlvbiBzcGVlZFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbTogRWxlbWVudFJlZikge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZWxlbS5uYXRpdmVFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICB0aGlzLmluaXRPcHRpb25zKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0SW1hZ2VzTGF5b3V0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2xpZGVzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q29udHJvbHMoKTtcclxuICAgICAgICB0aGlzLmluaXRBdXRvUGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuZCBzZXQgb3B0aW9ucyBmcm9tIGRpcmVjdGl2ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXRPcHRpb25zKCkge1xyXG5cclxuICAgICAgICAvLyBBbmltYXRpb24gZHVyYXRpb24gKGluIG1zKVxyXG4gICAgICAgIGlmICh0aGlzLmNhcm91c2VsQW5pbWF0aW9uU3BlZWQgJiYgQ2Fyb3VzZWxEaXJlY3RpdmUuaXNOdW1lcmljKHRoaXMuY2Fyb3VzZWxBbmltYXRpb25TcGVlZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbEFuaW1hdGlvblNwZWVkID0gK3RoaXMuY2Fyb3VzZWxBbmltYXRpb25TcGVlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxBbmltYXRpb25TcGVlZCA9IENhcm91c2VsRGlyZWN0aXZlLmFuaW1hdGlvblNwZWVkRGVmYXVsdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEF1dG9wbGF5IChpbiBtcykgKyBhbmltYXRpb24gZHVyYXRpb25cclxuICAgICAgICBpZiAodGhpcy5jYXJvdXNlbFNwZWVkICYmIENhcm91c2VsRGlyZWN0aXZlLmlzTnVtZXJpYyh0aGlzLmNhcm91c2VsU3BlZWQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxTcGVlZCA9ICsodGhpcy5jYXJvdXNlbFNwZWVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxTcGVlZCA9IENhcm91c2VsRGlyZWN0aXZlLmF1dG9QbGF5U3BlZWREZWZhdWx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGFycm93IHR5cGVcclxuICAgICAgICBpZiAodGhpcy5jYXJvdXNlbEFycm93cykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuY2Fyb3VzZWxBcnJvd3MpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ25vbmUnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyb3dUeXBlID0gQ2Fyb3VzZWxBcnJvd1R5cGVzLk5PTkU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzbWFsbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJvd1R5cGUgPSBDYXJvdXNlbEFycm93VHlwZXMuU01BTEw7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdub3JtYWwnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyb3dUeXBlID0gQ2Fyb3VzZWxBcnJvd1R5cGVzLk5PUk1BTDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2JvbGQnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyb3dUeXBlID0gQ2Fyb3VzZWxBcnJvd1R5cGVzLkJPTEQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICduYXJyb3cnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyb3dUeXBlID0gQ2Fyb3VzZWxBcnJvd1R5cGVzLk5BUlJPVztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgY2Fyb3VzZWwgbGF5b3V0XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdENvbnRhaW5lcigpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5ob3Jpem9udGFsQWxpZ25tZW50ID0gXCJjZW50ZXJcIjtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRSb3cobmV3IEl0ZW1TcGVjKDEsIFwiYXV0b1wiKSk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ29sdW1uKG5ldyBJdGVtU3BlYygxLCBcInN0YXJcIikpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENvbHVtbihuZXcgSXRlbVNwZWMoMSwgXCJzdGFyXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgc2xpZGVycyBsYXlvdXRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0SW1hZ2VzTGF5b3V0KCkge1xyXG4gICAgICAgIHRoaXMudG90YWxJdGVtcyA9IHRoaXMuY2Fyb3VzZWwubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWxTbGlkZXMgPSBuZXcgR3JpZExheW91dCgpO1xyXG4gICAgICAgIEdyaWRMYXlvdXQuc2V0Q29sdW1uU3Bhbih0aGlzLmNhcm91c2VsU2xpZGVzLCAyKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLmNhcm91c2VsU2xpZGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgY2Fyb3VzZWwgc2xpZGVycyBwcm92aWRlZCBpbiBcImNhcm91c2VsXCIgZGlyZWN0aXZlIGF0dHJpYnV0ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXRTbGlkZXMoKSB7XHJcbiAgICAgICAgdGhpcy5jYXJvdXNlbC5mb3JFYWNoKChzbGlkZTogQ2Fyb3VzZWxTbGlkZSwgaTogbnVtYmVyKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZ3JpZExheW91dCA9IG5ldyBHcmlkTGF5b3V0KCk7XHJcbiAgICAgICAgICAgIGdyaWRMYXlvdXQuYWRkUm93KG5ldyBJdGVtU3BlYygxLCBcImF1dG9cIikpO1xyXG4gICAgICAgICAgICBncmlkTGF5b3V0LnZpc2liaWxpdHkgPSBpID09IDAgPyBcInZpc2libGVcIiA6IFwiY29sbGFwc2VcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChzbGlkZS51cmwpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbWFnZTogSW1hZ2UgPSBDYXJvdXNlbERpcmVjdGl2ZS5nZW5lcmF0ZUltYWdlU2xpZGVyRnJvbVVybChzbGlkZS51cmwpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZExheW91dC5hZGRDaGlsZChpbWFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzbGlkZS5maWxlICYmIHNsaWRlLmZpbGUuaW5kZXhPZigncmVzOi8vJykgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbWFnZTogSW1hZ2UgPSBDYXJvdXNlbERpcmVjdGl2ZS5nZW5lcmF0ZUltYWdlU2xpZGVyRnJvbUZpbGUoc2xpZGUuZmlsZSk7XHJcbiAgICAgICAgICAgICAgICBncmlkTGF5b3V0LmFkZENoaWxkKGltYWdlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNsaWRlLmZpbGUgJiYgc2xpZGUuZmlsZS5pbmRleE9mKCdyZXM6Ly8nKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGltYWdlOiBJbWFnZSA9IENhcm91c2VsRGlyZWN0aXZlLmdlbmVyYXRlSW1hZ2VTbGlkZXJGcm9tUmVzb3VyY2Uoc2xpZGUuZmlsZSk7XHJcbiAgICAgICAgICAgICAgICBncmlkTGF5b3V0LmFkZENoaWxkKGltYWdlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNsaWRlLnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGl0bGU6IExhYmVsID0gQ2Fyb3VzZWxEaXJlY3RpdmUuZ2VuZXJhdGVUaXRsZVNsaWRlcihzbGlkZS50aXRsZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYXJvdXNlbExhYmVsT3ZlcmxheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWRMYXlvdXQuYWRkUm93KG5ldyBJdGVtU3BlYygxLCBcImF1dG9cIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIEdyaWRMYXlvdXQuc2V0Um93KHRpdGxlLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdyaWRMYXlvdXQuYWRkQ2hpbGQodGl0bGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxTbGlkZXMuYWRkQ2hpbGQoZ3JpZExheW91dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkIGltYWdlcyBmcm9tIFVSTFxyXG4gICAgICogQHBhcmFtIHNyY1xyXG4gICAgICogQHJldHVybnMge0ltYWdlfVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZUltYWdlU2xpZGVyRnJvbVVybChzcmM6IHN0cmluZyk6IEltYWdlIHtcclxuICAgICAgICBsZXQgaW1hZ2U6IEltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1hZ2Uuc3JjID0gc3JjO1xyXG4gICAgICAgIGltYWdlLmNsYXNzTmFtZSA9IFwic2xpZGVyLWltYWdlXCI7XHJcbiAgICAgICAgcmV0dXJuIGltYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZCBpbWFnZXMgZnJvbSBmaWxlXHJcbiAgICAgKiBAcGFyYW0gcGF0aFxyXG4gICAgICogQHJldHVybnMge0ltYWdlfVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZUltYWdlU2xpZGVyRnJvbUZpbGUocGF0aDogc3RyaW5nKTogSW1hZ2Uge1xyXG4gICAgICAgIGxldCBpbWFnZTogSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWFnZS5pbWFnZVNvdXJjZSA9IGZyb21GaWxlKHBhdGgpO1xyXG4gICAgICAgIGltYWdlLmNsYXNzTmFtZSA9IFwic2xpZGVyLWltYWdlXCI7XHJcbiAgICAgICAgcmV0dXJuIGltYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZCBpbWFnZXMgZnJvbSBmaWxlXHJcbiAgICAgKiBAcGFyYW0gcGF0aFxyXG4gICAgICogQHJldHVybnMge0ltYWdlfVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZUltYWdlU2xpZGVyRnJvbVJlc291cmNlKHBhdGg6IHN0cmluZyk6IEltYWdlIHtcclxuICAgICAgICBsZXQgaW1hZ2U6IEltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgbGV0IHBhdGhSYXc6IHN0cmluZyA9IHBhdGgucmVwbGFjZSgncmVzOi8vJywgJycpO1xyXG4gICAgICAgIGltYWdlLmltYWdlU291cmNlID0gZnJvbVJlc291cmNlKHBhdGhSYXcpO1xyXG4gICAgICAgIGltYWdlLmNsYXNzTmFtZSA9IFwic2xpZGVyLWltYWdlXCI7XHJcbiAgICAgICAgcmV0dXJuIGltYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGUgdGl0bGUgc2xpZGVyIGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB0aXRsZVxyXG4gICAgICogQHJldHVybnMge0xhYmVsfVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZVRpdGxlU2xpZGVyKHRpdGxlOiBzdHJpbmcpOiBMYWJlbCB7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gbmV3IExhYmVsKCk7XHJcbiAgICAgICAgbGFiZWwudGV4dCA9IHRpdGxlO1xyXG4gICAgICAgIGxhYmVsLnRleHRXcmFwID0gdHJ1ZTtcclxuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSAnc2xpZGVyLXRpdGxlJztcclxuICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0IGNhcm91c2VsIGNvbnRyb2xzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdENvbnRyb2xzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRvdGFsSXRlbXMgPiAxKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgQXJyb3cgdHlwZVxyXG4gICAgICAgICAgICBsZXQgYXJyb3dUeXBlID0gdGhpcy5nZXRBcnJvd1R5cGUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExlZnQgYXJyb3cgbGFiZWxcclxuICAgICAgICAgICAgbGV0IGxMYWJlbCA9IG5ldyBMYWJlbCgpO1xyXG4gICAgICAgICAgICBsTGFiZWwudGV4dCA9IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoYXJyb3dUeXBlLmwsIDE2KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBMZWZ0IGFycm93IGxheW91dFxyXG4gICAgICAgICAgICBsZXQgbFN0YWNrTGF5b3V0ID0gbmV3IFN0YWNrTGF5b3V0KCk7XHJcbiAgICAgICAgICAgIGxTdGFja0xheW91dC5hZGRDaGlsZChsTGFiZWwpO1xyXG4gICAgICAgICAgICBsU3RhY2tMYXlvdXQuaG9yaXpvbnRhbEFsaWdubWVudCA9IFwibGVmdFwiO1xyXG4gICAgICAgICAgICBsU3RhY2tMYXlvdXQub24oR2VzdHVyZVR5cGVzLnRhcCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wU3RhcnRBdXRvcGxheSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2lwZShDYXJvdXNlbERpcmVjdGlvbnMuRElSRUNUSU9OX0xFRlQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbFN0YWNrTGF5b3V0LmNsYXNzTmFtZSA9ICdhcnJvdyBhcnJvdy1sZWZ0JztcclxuICAgICAgICAgICAgR3JpZExheW91dC5zZXRDb2x1bW4obFN0YWNrTGF5b3V0LCAwKTtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ2hpbGQobFN0YWNrTGF5b3V0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJpZ2h0IGFycm93IGxhYmVsXHJcbiAgICAgICAgICAgIGxldCByTGFiZWwgPSBuZXcgTGFiZWwoKTtcclxuICAgICAgICAgICAgckxhYmVsLnRleHQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGFycm93VHlwZS5yLCAxNikpO1xyXG5cclxuICAgICAgICAgICAgLy8gTGVmdCBhcnJvdyBsYXlvdXRcclxuICAgICAgICAgICAgbGV0IHJTdGFja0xheW91dCA9IG5ldyBTdGFja0xheW91dCgpO1xyXG4gICAgICAgICAgICByU3RhY2tMYXlvdXQuYWRkQ2hpbGQockxhYmVsKTtcclxuICAgICAgICAgICAgclN0YWNrTGF5b3V0Lmhvcml6b250YWxBbGlnbm1lbnQgPSBcInJpZ2h0XCI7XHJcbiAgICAgICAgICAgIHJTdGFja0xheW91dC5vbihHZXN0dXJlVHlwZXMudGFwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BTdGFydEF1dG9wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXBlKENhcm91c2VsRGlyZWN0aW9ucy5ESVJFQ1RJT05fUklHSFQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgclN0YWNrTGF5b3V0LmNsYXNzTmFtZSA9ICdhcnJvdyBhcnJvdy1yaWdodCc7XHJcbiAgICAgICAgICAgIEdyaWRMYXlvdXQuc2V0Q29sdW1uKHJTdGFja0xheW91dCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENoaWxkKHJTdGFja0xheW91dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdCBjYXJvdXNzZWwgYXV0b3BsYXlcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0QXV0b1BsYXkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2Fyb3VzZWxTcGVlZCAmJiBDYXJvdXNlbERpcmVjdGl2ZS5pc051bWVyaWModGhpcy5jYXJvdXNlbFNwZWVkKSkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuYXV0b1BsYXlJbnRlcnZhbElkKTtcclxuICAgICAgICAgICAgdGhpcy5hdXRvUGxheUludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXBlKENhcm91c2VsRGlyZWN0aW9ucy5ESVJFQ1RJT05fUklHSFQpO1xyXG4gICAgICAgICAgICB9LCB0aGlzLmNhcm91c2VsU3BlZWQgKyB0aGlzLmNhcm91c2VsQW5pbWF0aW9uU3BlZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN0b3Agb24gZ2VzdHVyZSBkZXRlY3RlZCwgcmVzdW1lIGFmdGVyIDQgc2Vjb25kc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0b3BTdGFydEF1dG9wbGF5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmF1dG9QbGF5SW50ZXJ2YWxJZCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5hdXRvUGxheVRpbWVvdXRJZCk7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5hdXRvUGxheUludGVydmFsSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9QbGF5VGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXBlKENhcm91c2VsRGlyZWN0aW9ucy5ESVJFQ1RJT05fUklHSFQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0QXV0b1BsYXkoKTtcclxuICAgICAgICAgICAgfSwgNDAwMClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbmltYXRlIHJpZ2h0IHRvIGxlZnQgb3IgbGVmdCB0byByaWdodFxyXG4gICAgICogQHBhcmFtIGRpcmVjdGlvblxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3dpcGUoZGlyZWN0aW9uOiBDYXJvdXNlbERpcmVjdGlvbnMpIHtcclxuXHJcbiAgICAgICAgLy8gRG8gbm90aGluZywgaGF5IHNvbG8gdW5hIGltYWdlbi4uLlxyXG4gICAgICAgIGlmICh0aGlzLnRvdGFsSXRlbXMgPCAyIHx8IHRoaXMubW92aW5nSW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFuaW1hdGUgc2xpZGVzXHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcbiAgICAgICAgdGhpcy5tb3ZpbmdJbWFnZXMgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uVmFsdWVzKCk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRlU2xpZGVzKCk7XHJcblxyXG4gICAgICAgIC8vIFJlc2V0IGFsbCBhZnRlciBhbmltYXRpb25cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVzZXRBbmltYXRpb25WYWx1ZXMoKSwgdGhpcy5jYXJvdXNlbEFuaW1hdGlvblNwZWVkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuaW1hdGUgc2xpZGVzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYW5pbWF0ZVNsaWRlcygpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2Fyb3VzZWxTbGlkZXMuZ2V0Q2hpbGRyZW5Db3VudCgpOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB2aWV3XHJcbiAgICAgICAgICAgIGxldCB2aWV3OiBWaWV3ID0gdGhpcy5jYXJvdXNlbFNsaWRlcy5nZXRDaGlsZEF0KGkpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IGVsZW1lbnQgd2lkdGggKyBpbWFnZSB2aXNpYmlsaXR5XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50V2lkdGggPSB0aGlzLmVsZW0ubmF0aXZlRWxlbWVudC5nZXRBY3R1YWxTaXplKCkud2lkdGg7XHJcbiAgICAgICAgICAgIHZpZXcudmlzaWJpbGl0eSA9IFt0aGlzLmluZGV4TW92ZUNlbnRlciwgdGhpcy5pbmRleE1vdmVMZWZ0LCB0aGlzLmluZGV4TW92ZVJpZ2h0XS5pbmRleE9mKGkpID4gLTEgPyBcInZpc2libGVcIiA6IFwiY29sbGFwc2VcIjtcclxuXHJcbiAgICAgICAgICAgIC8vIFBlcmZyb20gYW5pbWF0aW9uXHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDTCh2aWV3LCBpLCBlbGVtZW50V2lkdGgpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrQ1IodmlldywgaSwgZWxlbWVudFdpZHRoKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja1JDKHZpZXcsIGksIGVsZW1lbnRXaWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tMQyh2aWV3LCBpLCBlbGVtZW50V2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdmUgaW1hZ2UgY2VudGVyIC0+IGxlZnRcclxuICAgICAqIEBwYXJhbSB2aWV3XHJcbiAgICAgKiBAcGFyYW0gaW5kZXhcclxuICAgICAqIEBwYXJhbSBlbGVtZW50V2lkdGhcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjaGVja0NMKHZpZXc6IFZpZXcsIGluZGV4OiBudW1iZXIsIGVsZW1lbnRXaWR0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5kZXhNb3ZlTGVmdCA9PSBpbmRleCkge1xyXG4gICAgICAgICAgICB2aWV3LnRyYW5zbGF0ZVggPSAwO1xyXG4gICAgICAgICAgICB2aWV3LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlOiB7eDogZWxlbWVudFdpZHRoLCB5OiAwfSxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLmNhcm91c2VsQW5pbWF0aW9uU3BlZWQsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogQW5pbWF0aW9uQ3VydmUuZWFzZUluXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdmUgaW1hZ2UgcmlnaHQgLT4gY2VudGVyXHJcbiAgICAgKiBAcGFyYW0gdmlld1xyXG4gICAgICogQHBhcmFtIGluZGV4XHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFdpZHRoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY2hlY2tSQyh2aWV3OiBWaWV3LCBpbmRleDogbnVtYmVyLCBlbGVtZW50V2lkdGg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmluZGV4TW92ZUNlbnRlciA9PSBpbmRleCAmJiB0aGlzLmRpcmVjdGlvbiA9PSBDYXJvdXNlbERpcmVjdGlvbnMuRElSRUNUSU9OX0xFRlQpIHtcclxuICAgICAgICAgICAgdmlldy50cmFuc2xhdGVYID0gLWVsZW1lbnRXaWR0aDtcclxuICAgICAgICAgICAgdmlldy5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZToge3g6IDAsIHk6IDB9LFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuY2Fyb3VzZWxBbmltYXRpb25TcGVlZCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBBbmltYXRpb25DdXJ2ZS5lYXNlT3V0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdmUgaW1hZ2UgY2VudGVyIC0+IHJpZ2h0XHJcbiAgICAgKiBAcGFyYW0gdmlld1xyXG4gICAgICogQHBhcmFtIGluZGV4XHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFdpZHRoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY2hlY2tDUih2aWV3OiBWaWV3LCBpbmRleDogbnVtYmVyLCBlbGVtZW50V2lkdGg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmluZGV4TW92ZVJpZ2h0ID09IGluZGV4KSB7XHJcbiAgICAgICAgICAgIHZpZXcudHJhbnNsYXRlWCA9IDA7XHJcbiAgICAgICAgICAgIHZpZXcuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGU6IHt4OiAtZWxlbWVudFdpZHRoLCB5OiAwfSxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLmNhcm91c2VsQW5pbWF0aW9uU3BlZWQsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogQW5pbWF0aW9uQ3VydmUuZWFzZUluXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdmUgaW1hZ2UgbGVmdCAtPiBjZW50ZXJcclxuICAgICAqIEBwYXJhbSB2aWV3XHJcbiAgICAgKiBAcGFyYW0gaW5kZXhcclxuICAgICAqIEBwYXJhbSBlbGVtZW50V2lkdGhcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjaGVja0xDKHZpZXc6IFZpZXcsIGluZGV4OiBudW1iZXIsIGVsZW1lbnRXaWR0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5kZXhNb3ZlQ2VudGVyID09IGluZGV4ICYmIHRoaXMuZGlyZWN0aW9uID09IENhcm91c2VsRGlyZWN0aW9ucy5ESVJFQ1RJT05fUklHSFQpIHtcclxuICAgICAgICAgICAgdmlldy50cmFuc2xhdGVYID0gZWxlbWVudFdpZHRoO1xyXG4gICAgICAgICAgICB2aWV3LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlOiB7eDogMCwgeTogMH0sXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5jYXJvdXNlbEFuaW1hdGlvblNwZWVkLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IEFuaW1hdGlvbkN1cnZlLmVhc2VPdXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHZhbHVlcyB0byBwZXJmb3JtIHRoZSBhbmltYXRpb25cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzZXREaXJlY3Rpb25WYWx1ZXMoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmRpcmVjdGlvbikge1xyXG5cclxuICAgICAgICAgICAgLy8gcmlnaHQgdG8gbGVmdFxyXG4gICAgICAgICAgICBjYXNlIENhcm91c2VsRGlyZWN0aW9ucy5ESVJFQ1RJT05fTEVGVDpcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhNb3ZlTGVmdCA9IHRoaXMuY3VycmVudEltYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SW1hZ2UgPSAoKHRoaXMuY3VycmVudEltYWdlID09IDAgPyB0aGlzLnRvdGFsSXRlbXMgOiB0aGlzLmN1cnJlbnRJbWFnZSkgLSAxKSAlIHRoaXMudG90YWxJdGVtcztcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhNb3ZlQ2VudGVyID0gdGhpcy5jdXJyZW50SW1hZ2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIGxlZnQgdG8gcmlnaHRcclxuICAgICAgICAgICAgY2FzZSBDYXJvdXNlbERpcmVjdGlvbnMuRElSRUNUSU9OX1JJR0hUOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleE1vdmVSaWdodCA9IHRoaXMuY3VycmVudEltYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SW1hZ2UgPSAodGhpcy5jdXJyZW50SW1hZ2UgKyAxKSAlIHRoaXMudG90YWxJdGVtcztcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhNb3ZlQ2VudGVyID0gdGhpcy5jdXJyZW50SW1hZ2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldCB2YWx1ZXMgYWZ0ZXIgYW5pbWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVzZXRBbmltYXRpb25WYWx1ZXMoKSB7XHJcbiAgICAgICAgdGhpcy5pbmRleE1vdmVMZWZ0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmluZGV4TW92ZVJpZ2h0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmluZGV4TW92ZUNlbnRlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5tb3ZpbmdJbWFnZXMgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhcnJvdyB0eXBlIHRvIGJlIGRpc3BsYXllZCBpbiBmcm9udGVuZFxyXG4gICAgICogQHJldHVybnMge3tsOiBzdHJpbmcsIHI6IHN0cmluZ319XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0QXJyb3dUeXBlKCkge1xyXG4gICAgICAgIGxldCByZXQgPSB7bDogJycsIHI6ICcnfTtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuYXJyb3dUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQ2Fyb3VzZWxBcnJvd1R5cGVzLk5PTkU6XHJcbiAgICAgICAgICAgICAgICByZXQubCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgcmV0LnIgPSAnJztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENhcm91c2VsQXJyb3dUeXBlcy5TTUFMTDpcclxuICAgICAgICAgICAgICAgIHJldC5sID0gJzIwMzknO1xyXG4gICAgICAgICAgICAgICAgcmV0LnIgPSAnMjAzQSc7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY2FzZSBDYXJvdXNlbEFycm93VHlwZXMuTk9STUFMOlxyXG4gICAgICAgICAgICAgICAgcmV0LmwgPSAnMjc2RSc7XHJcbiAgICAgICAgICAgICAgICByZXQuciA9ICcyNzZGJztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENhcm91c2VsQXJyb3dUeXBlcy5CT0xEOlxyXG4gICAgICAgICAgICAgICAgcmV0LmwgPSAnMjc3MCc7XHJcbiAgICAgICAgICAgICAgICByZXQuciA9ICcyNzcxJztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENhcm91c2VsQXJyb3dUeXBlcy5OQVJST1c6XHJcbiAgICAgICAgICAgICAgICByZXQubCA9ICcyMzI5JztcclxuICAgICAgICAgICAgICAgIHJldC5yID0gJzIzMkEnO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBudW1lcmljIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0gdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpc051bWVyaWModmFsdWU6IGFueSkge1xyXG4gICAgICAgIHJldHVybiAhaXNOYU4odmFsdWUgLSBwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmVudW0gQ2Fyb3VzZWxBcnJvd1R5cGVzIHtcclxuICAgIE5PTkUsXHJcbiAgICBTTUFMTCxcclxuICAgIE5BUlJPVyxcclxuICAgIE5PUk1BTCxcclxuICAgIEJPTERcclxufVxyXG5cclxuZW51bSBDYXJvdXNlbERpcmVjdGlvbnMge1xyXG4gICAgRElSRUNUSU9OX0xFRlQsXHJcbiAgICBESVJFQ1RJT05fUklHSFRcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhcm91c2VsU2xpZGUge1xyXG4gICAgdXJsPzogc3RyaW5nO1xyXG4gICAgZmlsZT86IHN0cmluZztcclxuICAgIHRpdGxlPzogc3RyaW5nO1xyXG59Il19