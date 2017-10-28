"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var pre_header_1 = require("./chunks/pre-header");
var ihdr_1 = require("./chunks/ihdr");
var palette_1 = require("./chunks/palette");
var iend_1 = require("./chunks/iend");
var idat_1 = require("./chunks/idat");
var arraybuffer_walker_1 = require("./util/arraybuffer-walker");
var rgba_to_palette_array_1 = require("./rgba-to-palette-array");
function calculateBufferLength(width, height, numColors) {
    // Before we write anything we need to work out the size of ArrayBuffer
    // we need. This is a combination of a whole load of factors, so we
    // separate out the logic into different chunks.
    return pre_header_1.length + ihdr_1.IHDRLength + palette_1.calculatePaletteLength(numColors) + idat_1.calculateIDATLength(width, height) + iend_1.length;
}
/**
 * Create a PngPong-suitable PNG ArrayBuffer from an existing RGBA array. Combine
 * this with PNGJS to transform an existing PNG image into something PngPong can use.
 *
 * @export
 * @param {number} width
 * @param {number} height
 * @param {Uint8ClampedArray} rgbaData
 * @param {number} extraPaletteSpaces - How many extra palette entries should we make available for new colors, after we've added the colors from the existing array?
 * @returns
 */
function createFromRGBAArray(width, height, rgbaData, extraPaletteSpaces) {
    if (extraPaletteSpaces === void 0) {
        extraPaletteSpaces = 0;
    }
    var _a = rgba_to_palette_array_1.RGBAtoPalettedArray(rgbaData, extraPaletteSpaces),
        rgbPalette = _a.rgbPalette,
        alphaPalette = _a.alphaPalette,
        data = _a.data;
    var arrayBufferLength = calculateBufferLength(width, height, alphaPalette.length + extraPaletteSpaces);
    var buffer = new ArrayBuffer(arrayBufferLength);
    var walker = new arraybuffer_walker_1.ArrayBufferWalker(buffer);
    pre_header_1.writePreheader(walker);
    ihdr_1.writeIHDR(walker, {
        width: width,
        height: height,
        colorType: ihdr_1.PNGColorType.Palette,
        bitDepth: 8,
        compressionMethod: 0,
        filter: 0,
        interface: 0
    });
    palette_1.writePalette(walker, rgbPalette, alphaPalette);
    idat_1.writeIDAT(walker, data, width);
    iend_1.writeIEND(walker);
    return buffer;
}
exports.createFromRGBAArray = createFromRGBAArray;
/**
 * Create a PngPong-suitable ArrayBuffer based on the arguments provided.
 *
 * @export
 * @param {number} width
 * @param {number} height
 * @param {number} paletteSize - Must be at least 1, and at least 2 if specifying a background color.
 * @param {RGB} [backgroundColor]
 * @returns
 */
function createWithMetadata(width, height, paletteSize, backgroundColor) {
    var length = calculateBufferLength(width, height, paletteSize);
    var buffer = new ArrayBuffer(length);
    var walker = new arraybuffer_walker_1.ArrayBufferWalker(buffer);
    pre_header_1.writePreheader(walker);
    ihdr_1.writeIHDR(walker, {
        width: width,
        height: height,
        colorType: ihdr_1.PNGColorType.Palette,
        bitDepth: 8,
        compressionMethod: 0,
        filter: 0,
        interface: 0
    });
    var rgbColors = new Uint8ClampedArray(paletteSize * 3);
    var alphaValues = new Uint8ClampedArray(paletteSize);
    if (backgroundColor) {
        rgbColors[3] = backgroundColor[0];
        rgbColors[4] = backgroundColor[1];
        rgbColors[5] = backgroundColor[2];
        alphaValues[1] = 255;
    }
    palette_1.writePalette(walker, rgbColors, alphaValues);
    if (backgroundColor) {
        // The background color will be palette entry #1, as RGBA(0,0,0,0) is
        // always entry #0
        idat_1.writeIDATConstant(walker, 1, width, height);
    } else {
        idat_1.writeIDATConstant(walker, 0, width, height);
    }
    iend_1.writeIEND(walker);
    return buffer;
}
exports.createWithMetadata = createWithMetadata;
//# sourceMappingURL=writer.js.map