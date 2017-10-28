"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var writer_1 = require("../../src/writer");
function createBlankPNG(width, height, backgroundColor, extraPaletteSpaces) {
    if (extraPaletteSpaces === void 0) {
        extraPaletteSpaces = 0;
    }
    if (backgroundColor.length === 3) {
        backgroundColor.push(255);
    }
    var bgColors = new Uint8ClampedArray(backgroundColor);
    var sourceArray = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < sourceArray.length; i = i + 4) {
        sourceArray.set(bgColors, i);
    }
    return writer_1.createFromRGBAArray(width, height, sourceArray, extraPaletteSpaces);
}
exports.createBlankPNG = createBlankPNG;
//# sourceMappingURL=blank-png.js.map