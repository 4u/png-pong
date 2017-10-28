"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The color type our image uses. PngPong currently only supports
 * Palette images, PNGColorType.Palette
 *
 * @export
 * @enum {number}
 */
var PNGColorType;
(function (PNGColorType) {
    PNGColorType[PNGColorType["Grayscale"] = 0] = "Grayscale";
    PNGColorType[PNGColorType["RGB"] = 2] = "RGB";
    PNGColorType[PNGColorType["Palette"] = 3] = "Palette";
    PNGColorType[PNGColorType["GrayscaleWithAlpha"] = 4] = "GrayscaleWithAlpha";
    PNGColorType[PNGColorType["RGBA"] = 6] = "RGBA";
})(PNGColorType = exports.PNGColorType || (exports.PNGColorType = {}));
function writeIHDR(walker, options) {
    // IHDR length is always 13 bytes
    walker.writeUint32(13);
    walker.startCRC();
    walker.writeString("IHDR");
    walker.writeUint32(options.width);
    walker.writeUint32(options.height);
    walker.writeUint8(options.bitDepth);
    walker.writeUint8(options.colorType);
    walker.writeUint8(options.compressionMethod);
    walker.writeUint8(options.filter);
    walker.writeUint8(options.interface);
    walker.writeCRC();
}
exports.writeIHDR = writeIHDR;
/**
 * Read out the values contained within IHDR. Does not let you edit these
 * values, as changing pretty much any of them would make the IDAT chunk
 * totally invalid.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {number} length
 * @returns {IHDROptions}
 */
function readIHDR(walker, length) {
    if (length !== 13) {
        throw new Error("IHDR length must always be 13");
    }
    var width = walker.readUint32();
    var height = walker.readUint32();
    var bitDepth = walker.readUint8();
    var colorType = walker.readUint8();
    var compressionMethod = walker.readUint8();
    var filter = walker.readUint8();
    var pngInterface = walker.readUint8();
    // Don't do anything with this as we can't edit the header
    var crc = walker.readUint32();
    return {
        width: width,
        height: height,
        bitDepth: bitDepth,
        colorType: colorType,
        compressionMethod: compressionMethod,
        filter: filter,
        interface: pngInterface
    };
}
exports.readIHDR = readIHDR;
/**
 *  IHDR length is always 13 bytes. So we can store this as a constant.
 */
exports.IHDRLength = 4 // Chunk length identifier
+ 4 // chunk header
+ 13 // actual IHDR length
+ 4; // CRC32 check;
//# sourceMappingURL=ihdr.js.map