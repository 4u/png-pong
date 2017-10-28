"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Write both the PLTE and tRNS chunks of the PNG file.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {Uint8ClampedArray} rgbPalette
 * @param {Uint8ClampedArray} alphaPalette
 */
function writePalette(walker, rgbPalette, alphaPalette) {
    // Write PTLE
    walker.writeUint32(rgbPalette.length);
    walker.startCRC();
    walker.writeString("PLTE");
    for (var i = 0; i < rgbPalette.length; i++) {
        walker.writeUint8(rgbPalette[i]);
    }
    walker.writeCRC();
    // Write tRNS
    walker.writeUint32(alphaPalette.length);
    walker.startCRC();
    walker.writeString("tRNS");
    for (var i = 0; i < alphaPalette.length; i++) {
        walker.writeUint8(alphaPalette[i]);
    }
    walker.writeCRC();
}
exports.writePalette = writePalette;
/**
 * A manager that handles both the PLTE and tRNS chunks, as they depend upon each other.
 *
 * @export
 * @class Palette
 */
var Palette = /** @class */function () {
    function Palette(walker, rgbPalette, alphaPalette) {
        this.walker = walker;
        this.rgbPalette = rgbPalette;
        this.alphaPalette = alphaPalette;
    }
    Palette.prototype.writeCRCs = function () {
        this.walker.offset = this.rgbPalette.offset - 4; // CRC includes the identifier text
        this.walker.startCRC();
        this.walker.skip(4 + this.rgbPalette.length);
        this.walker.writeCRC();
        if (this.alphaPalette) {
            this.walker.offset = this.alphaPalette.offset - 4;
            this.walker.startCRC();
            this.walker.skip(4 + this.alphaPalette.length);
            this.walker.writeCRC();
        }
    };
    Palette.prototype.checkColor = function (rgba) {
        if (rgba.length < 3 || rgba.length > 4) {
            throw new Error("Needs to be a 3 or 4 length array to check for color");
        }
        if (rgba.length === 3 && this.alphaPalette) {
            // If we need to search for alpha, just insert zero transparency
            rgba.push(255);
        }
    };
    /**
     * Return the RGBA color at the index provided. If there is no tRNS chunk the
     * color will always have an alpha value of 255.
     *
     * @param {number} idx
     * @returns The RGBA color at this index. If the color hasn't been specified it
     * will come back as [0,0,0,255].
     *
     * @memberof Palette
     */
    Palette.prototype.getColorAtIndex = function (idx) {
        var rgbStartingIndex = idx * 3;
        var rgba = [this.walker.array[this.rgbPalette.offset + rgbStartingIndex], this.walker.array[this.rgbPalette.offset + rgbStartingIndex + 1], this.walker.array[this.rgbPalette.offset + rgbStartingIndex + 2], 255];
        if (this.alphaPalette) {
            rgba[3] = this.walker.array[this.alphaPalette.offset + idx];
        }
        return rgba;
    };
    /**
     * Get the palette index for an existing color.
     *
     * @param {RGBA} rgba
     * @param {number} [startingIndex=0] - used internally to skip the first palette entry, which is always rgba(0,0,0,0)
     * @returns The index of the color, or -1 if the color has not yet been added to the palette.
     *
     * @memberof Palette
     */
    Palette.prototype.getColorIndex = function (rgba, startingIndex) {
        if (startingIndex === void 0) {
            startingIndex = 0;
        }
        this.checkColor(rgba);
        for (var i = this.rgbPalette.offset + startingIndex * 3; i < this.rgbPalette.offset + this.rgbPalette.length; i = i + 3) {
            if (this.walker.array[i] === rgba[0] && this.walker.array[i + 1] === rgba[1] && this.walker.array[i + 2] === rgba[2]) {
                // Because this an array of RGB values, the actual index is / 3
                var index = (i - this.rgbPalette.offset) / 3;
                if (!this.alphaPalette) {
                    // If we have no alpha palette then we've found our match.
                    return index;
                } else if (this.alphaPalette && this.walker.array[this.alphaPalette.offset + index] === rgba[3]) {
                    // Otherwise we need to check the alpha palette too.
                    return index;
                }
            }
        }
        return -1;
    };
    /**
     * Add a color to the palette. Must be an RGBA color, even if we're not using tRNS (to do: fix that)
     *
     * @param {RGBA} rgba
     * @returns the index the color was added at.
     *
     * @memberof Palette
     */
    Palette.prototype.addColor = function (rgba) {
        // need to save this to reset later.
        var currentWalkerOffset = this.walker.offset;
        this.checkColor(rgba);
        // We start at index 1 because the PNGWriter stores 0,0,0,0 at palette index #0
        // and we want to ignore that.
        var vacantSpace = this.getColorIndex([0, 0, 0, 0], 1);
        if (vacantSpace === -1) {
            if (this.rgbPalette.length < 255) {
                throw new Error("No space left in palette. You need to create a source image with more space.");
            }
            throw new Error("No space left in palette. You need to use fewer colours.");
        }
        var rgbStartWriteAt = this.rgbPalette.offset + vacantSpace * 3;
        // This feels like it kind of breaks the logic of using a walker
        // but the palette is this weird thing that we need to access at
        // different points...
        this.walker.offset = rgbStartWriteAt;
        this.walker.writeUint8(rgba[0]);
        this.walker.writeUint8(rgba[1]);
        this.walker.writeUint8(rgba[2]);
        if (this.alphaPalette) {
            this.walker.offset = this.alphaPalette.offset + vacantSpace;
            this.walker.writeUint8(rgba[3]);
        } else if (!this.alphaPalette && rgba[3] !== 255) {
            throw new Error("No alpha palette but color has alpha value.");
        }
        this.walker.offset = currentWalkerOffset;
        return vacantSpace;
    };
    return Palette;
}();
exports.Palette = Palette;
/**
 * Take an ArrayWalker and parse out the PLTE chunk and, if it exists, the tRNS chunk.
 * If it exists, the tRNS chunk MUST immediately follow the PLTE chunk.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {number} length
 * @returns
 */
function readPalette(walker, length) {
    var rgbPaletteBounds = { offset: walker.offset, length: length };
    walker.skip(length);
    var rgbCRC = walker.readUint32();
    // We might have a tRNS block next. But we also might not!
    var nextBlockLength = walker.readUint32();
    var nextBlockIdentifier = walker.readString(4);
    if (nextBlockIdentifier !== "tRNS") {
        // We want to move it back so that the transformer reader
        // can parse this block itself.
        walker.rewindString(4);
        walker.rewindUint32();
        return new Palette(walker, rgbPaletteBounds);
    } else {
        var alphaPalette = { offset: walker.offset, length: nextBlockLength };
        walker.skip(nextBlockLength);
        return new Palette(walker, rgbPaletteBounds, alphaPalette);
    }
}
exports.readPalette = readPalette;
/**
 * PNG files can have palettes of varying sizes, up to 256 colors. If we want
 * to try to save some space, we can use a smaller palette.
 *
 * @export
 * @param {number} numColors
 * @returns
 */
function calculatePaletteLength(numColors) {
    return numColors * 3 + // PLTE chunk size
    4 // PLTE identifier
    + 4 // PLTE CRC
    + 4 // PLTE length
    + numColors // tRNS chunk Size
    + 4 // tRNS identifier
    + 4 // tRNS CRC
    + 4; // tRNS length
}
exports.calculatePaletteLength = calculatePaletteLength;
//# sourceMappingURL=palette.js.map