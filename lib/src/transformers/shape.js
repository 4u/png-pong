"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A transformer to draw basic shapes onto an image. Currently only draws rectangles.
 *
 * @export
 * @class PngPongShapeTransformer
 */
var PngPongShapeTransformer = /** @class */function () {
    /**
     * Creates an instance of PngPongShapeTransformer.
     * @param {PngPong} baseTransformer - the transformer you want to draw onto.
     *
     * @memberof PngPongShapeTransformer
     */
    function PngPongShapeTransformer(baseTransformer) {
        var _this = this;
        this.baseTransformer = baseTransformer;
        this.operations = [];
        this.operationPaletteIndexes = [];
        baseTransformer.onHeader(function (h) {
            _this.imageWidth = h.width;
        });
        baseTransformer.onPalette(this.onPalette.bind(this));
        baseTransformer.onData(this.onData.bind(this));
    }
    PngPongShapeTransformer.prototype.onPalette = function (palette) {
        this.operationPaletteIndexes = this.operations.map(function (o) {
            var idx = palette.getColorIndex(o.color);
            if (idx === -1) {
                idx = palette.addColor(o.color);
            }
            return idx;
        });
    };
    PngPongShapeTransformer.prototype.onData = function (array, readOffset, x, y, length) {
        for (var idx = 0; idx < this.operations.length; idx++) {
            var o = this.operations[idx];
            if (y < o.y1 || y >= o.y2) {
                continue;
            }
            for (var i = Math.max(x, o.x1); i < Math.min(o.x2, x + length); i++) {
                array[readOffset - x + i] = this.operationPaletteIndexes[idx];
            }
        }
    };
    /**
     * Add a rectangle to the list of draw operations. Must use this before running PngPong.run()
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {RGB} color
     *
     * @memberof PngPongShapeTransformer
     */
    PngPongShapeTransformer.prototype.drawRect = function (x, y, width, height, color) {
        var x2 = x + width;
        var y2 = y + height;
        this.operations.push({
            x1: x,
            x2: x2,
            y1: y,
            y2: y2,
            color: color
        });
    };
    return PngPongShapeTransformer;
}();
exports.PngPongShapeTransformer = PngPongShapeTransformer;
//# sourceMappingURL=shape.js.map