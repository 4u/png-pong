"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var zlib_1 = require("../util/zlib");
/**
 * Write an IDAT chunk all at once. Typically used when creating a new blank image.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {Uint8ClampedArray} data
 * @param {number} width
 */
function writeIDAT(walker, data, width) {
    // We need to account for a row filter pixel in our chunk length
    var height = data.length / width;
    // Zlibbed data will take up more space than the raw data
    walker.writeUint32(zlib_1.calculateZlibbedLength(data.length + height));
    walker.startCRC();
    walker.writeString("IDAT");
    var zlibWriter = new zlib_1.ZlibWriter(walker, data.length + height);
    var currentX = 0;
    // Write our row filter byte
    zlibWriter.writeUint8(0);
    for (var i = 0; i < data.length; i++) {
        if (currentX === width) {
            currentX = 0;
            // Write our row filter byte
            zlibWriter.writeUint8(0);
        }
        zlibWriter.writeUint8(data[i]);
        currentX++;
    }
    zlibWriter.end();
    walker.writeCRC();
}
exports.writeIDAT = writeIDAT;
/**
 * Write an IDAT chunk without wasting memory on a source ArrayBuffer - if we want it all to be one
 * palette index.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {number} value - The palette index we want all the pixels to be
 * @param {number} width
 * @param {number} height
 */
function writeIDATConstant(walker, value, width, height) {
    var overallSize = (width + 1) * height; // +1 for row filter byte
    walker.writeUint32(zlib_1.calculateZlibbedLength(overallSize));
    walker.startCRC();
    walker.writeString("IDAT");
    var zlibWriter = new zlib_1.ZlibWriter(walker, overallSize);
    var currentX = 0;
    // Write our row filter byte
    zlibWriter.writeUint8(0);
    for (var i = 0; i < width * height; i++) {
        if (currentX === width) {
            currentX = 0;
            // Write our row filter byte
            zlibWriter.writeUint8(0);
        }
        zlibWriter.writeUint8(value);
        currentX++;
    }
    zlibWriter.end();
    walker.writeCRC();
}
exports.writeIDATConstant = writeIDATConstant;
/**
 * Calculate the length of an IDAT chunk. Because it uses both ZLib chunking
 * and a row filter byte at the start of each row, it isn't as simple as
 * width * height.
 *
 * @export
 * @param {number} width
 * @param {number} height
 * @returns
 */
function calculateIDATLength(width, height) {
    // +1 for row filter byte at the start of each row
    var bytes = (width + 1) * height;
    return 4 // Chunk length
    + 4 // Identifier
    + zlib_1.calculateZlibbedLength(bytes) + 4; // CRC
}
exports.calculateIDATLength = calculateIDATLength;
//# sourceMappingURL=idat.js.map