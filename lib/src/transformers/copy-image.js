"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../");
function alphaBlend(color1, color2, alpha) {
    var alphaMultiply = alpha / 255;
    var redDiff = color1[0] - color2[0];
    var greenDiff = color1[1] - color2[1];
    var blueDiff = color1[2] - color2[2];
    var newColor = [color1[0] - Math.round(redDiff * alphaMultiply), color1[1] - Math.round(greenDiff * alphaMultiply), color1[2] - Math.round(blueDiff * alphaMultiply)];
    return newColor;
}
/**
 * A transformer to copy one or more sections of an image onto another.
 *
 * @export
 * @class PngPongImageCopyTransformer
 */
var PngPongImageCopyTransformer = /** @class */function () {
    /**
     * Creates an instance of PngPongImageCopyTransformer.
     * @param {ArrayBuffer} sourceImage - the source PNG ArrayBuffer to read from. Must be
     * a PngPong suitable PNG.
     * @param {PngPong} targetTransformer - the transformer to add this image to.
     *
     * @memberof PngPongImageCopyTransformer
     */
    function PngPongImageCopyTransformer(sourceImage, targetTransformer) {
        this.sourceImage = sourceImage;
        this.targetTransformer = targetTransformer;
        this.operations = [];
        this.targetTransformer.onPalette(this.onPalette.bind(this));
        this.targetTransformer.onData(this.onData.bind(this));
    }
    /**
     * Add a copy operation to the transformer. Must be done before running PngPong.run().
     *
     * @param {number} sourceX
     * @param {number} sourceY
     * @param {number} sourceWidth
     * @param {number} sourceHeight
     * @param {number} targetX
     * @param {number} targetY
     * @param {ColorMaskOptions} [mask] - Optional argument to ignore the RGB value of the source image
     * and instead apply a color mask.
     *
     * @memberof PngPongImageCopyTransformer
     */
    PngPongImageCopyTransformer.prototype.copy = function (sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, mask) {
        var pixelsRequired = sourceWidth * sourceHeight;
        var pixels = new Uint8Array(pixelsRequired);
        this.operations.push({
            sourceX: sourceX,
            sourceY: sourceY,
            sourceWidth: sourceWidth,
            sourceHeight: sourceHeight,
            targetX: targetX,
            targetY: targetY,
            pixels: pixels,
            mask: mask
        });
    };
    PngPongImageCopyTransformer.prototype.onPalette = function (targetPalette) {
        // We need to grab our source image and add the new colors to the palette. At the same time
        // we record the new data arrays, to insert into the data later.
        var _this = this;
        var sourceTransformer = new _1.PngPong(this.sourceImage);
        // grab the palette to do lookups
        var sourcePalette;
        sourceTransformer.onPalette(function (p) {
            return sourcePalette = p;
        });
        sourceTransformer.onData(function (array, readOffset, x, y, length) {
            var _loop_1 = function (i) {
                _this.operations.forEach(function (operation) {
                    if (y < operation.sourceY || y >= operation.sourceY + operation.sourceHeight || x < operation.sourceX || x >= operation.sourceX + operation.sourceWidth) {
                        return;
                    }
                    var relativeX = x - operation.sourceX;
                    var relativeY = y - operation.sourceY;
                    var sourcePixel = sourcePalette.getColorAtIndex(array[readOffset + i]);
                    if (operation.mask) {
                        var maskColor = alphaBlend(operation.mask.backgroundColor, operation.mask.maskColor, sourcePixel[3]);
                        sourcePixel[0] = maskColor[0];
                        sourcePixel[1] = maskColor[1];
                        sourcePixel[2] = maskColor[2];
                    }
                    var targetPaletteIndex = targetPalette.getColorIndex(sourcePixel);
                    if (targetPaletteIndex === -1) {
                        targetPaletteIndex = targetPalette.addColor(sourcePixel);
                    }
                    var arrayIndex = relativeY * operation.sourceWidth + relativeX;
                    operation.pixels[arrayIndex] = targetPaletteIndex;
                });
                x++;
            };
            for (var i = 0; i < length; i++) {
                _loop_1(i);
            }
        });
        sourceTransformer.run();
    };
    PngPongImageCopyTransformer.prototype.onData = function (array, readOffset, x, y, length) {
        var _loop_2 = function (i) {
            this_1.operations.forEach(function (operation) {
                if (y < operation.targetY || y >= operation.targetY + operation.sourceHeight || x < operation.targetX || x >= operation.targetX + operation.sourceWidth) {
                    return;
                }
                var relativeX = x - operation.targetX;
                var relativeY = y - operation.targetY;
                var sourcePixel = operation.pixels[relativeY * operation.sourceWidth + relativeX];
                array[readOffset + i] = sourcePixel;
            });
            x++;
        };
        var this_1 = this;
        for (var i = 0; i < length; i++) {
            _loop_2(i);
        }
    };
    return PngPongImageCopyTransformer;
}();
exports.PngPongImageCopyTransformer = PngPongImageCopyTransformer;
//# sourceMappingURL=copy-image.js.map