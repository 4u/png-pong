"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var arraybuffer_walker_1 = require("./util/arraybuffer-walker");
var pre_header_1 = require("./chunks/pre-header");
var ihdr_1 = require("./chunks/ihdr");
var palette_1 = require("./chunks/palette");
var zlib_1 = require("./util/zlib");
var EventPayloads = /** @class */function () {
    function EventPayloads() {}
    return EventPayloads;
}();
;
/**
 * The core class for any image manipulation. Create an instance of this class
 * with the ArrayBuffer of your original PNG image, then apply your transforms
 * to it. Then execute PngPng.run() to apply those transforms.
 *
 * @export
 * @class PngPong
 */
var PngPong = /** @class */function () {
    /**
     * Creates an instance of PngPong.
     * @param {ArrayBuffer} source: The ArrayBuffer you want to apply
     * transforms to.
     *
     * @memberof PngPong
     */
    function PngPong(source) {
        this.source = source;
        this.headerListeners = [];
        this.paletteListeners = [];
        this.dataListeners = [];
        this.walker = new arraybuffer_walker_1.ArrayBufferWalker(source);
    }
    PngPong.prototype.readData = function (dataLength) {
        // Need to include the chunk identifier in the CRC. Need a better
        // way to do this.
        var _this = this;
        this.walker.skip(-4);
        this.walker.startCRC();
        this.walker.skip(4);
        var rowFilterBytesSkipped = 1;
        // Our PNG rows can be split across chunks, so we need to track
        // overall data length
        var dataReadSoFar = 0;
        zlib_1.readZlib(this.walker, function (arr, readOffset, dataOffset, length) {
            // The PNG stream has a row filter flag at the start of every row
            // which we want to disregard and not send to any listeners. So
            // we split up the data as we receive it into chunks, around that
            // flag.
            // ignore our first row flag
            var blockReadOffset = 0;
            var _loop_1 = function () {
                // In order to match rows across blocks and also ignore row flags,
                // we need to keep track of our current coordinate.
                var xAtThisPoint = dataReadSoFar % _this.width;
                if (blockReadOffset === 0 && xAtThisPoint === 0) {
                    // If we're starting a new block AND it's the start of a row,
                    // we need to skip our row filter byte
                    blockReadOffset++;
                }
                var yAtThisPoint = (dataReadSoFar - xAtThisPoint) / _this.width;
                // If we have an entire image row we can read, do that. If we have a partial
                // row, do that. If we have the end of a block, do that.
                var amountToRead = Math.min(_this.width - xAtThisPoint, length - blockReadOffset);
                _this.dataListeners.forEach(function (d) {
                    return d(_this.walker.array, readOffset + blockReadOffset, xAtThisPoint, yAtThisPoint, amountToRead);
                });
                // update our offsets to match the pixel amounts we just read
                dataReadSoFar += amountToRead;
                blockReadOffset += amountToRead;
                // now ALSO update our block offset to skip the next row filter byte
                blockReadOffset++;
            };
            while (blockReadOffset < length) {
                _loop_1();
            }
        });
        this.walker.writeCRC();
        // this.walker.skip(4)
        this.readChunk();
    };
    PngPong.prototype.readChunk = function () {
        var length = this.walker.readUint32();
        var identifier = this.walker.readString(4);
        if (identifier === "IHDR") {
            var hdr_1 = ihdr_1.readIHDR(this.walker, length);
            this.width = hdr_1.width;
            this.headerListeners.forEach(function (l) {
                l(hdr_1);
            });
            this.readChunk();
        } else if (identifier === "PLTE") {
            var plte_1 = palette_1.readPalette(this.walker, length);
            this.paletteListeners.forEach(function (l) {
                return l(plte_1);
            });
            plte_1.writeCRCs();
            this.readChunk();
        } else if (identifier === "IDAT") {
            this.readData(length);
        } else if (identifier === "IEND") {
            // we're done
        } else {
            throw new Error("Did not recognise " + length + " byte chunk: " + identifier);
        }
    };
    /**
     * Apply the transforms you've created to the original ArrayBuffer.
     *
     * @memberof PngPong
     */
    PngPong.prototype.run = function () {
        pre_header_1.checkPreheader(this.walker);
        this.readChunk();
    };
    /**
     * Add a callback to be run when the IHDR chunk of the PNG file has been
     * successfully read. You cannot edit the contents of the IHDR, but can
     * read values out of it.
     *
     * @param {Callback<IHDROptions>} listener
     *
     * @memberof PngPong
     */
    PngPong.prototype.onHeader = function (listener) {
        this.headerListeners.push(listener);
    };
    /**
     * Add a callback when the image palette has been processed. During this
     * callback you are able to add colors to the palette. If you save the
     * palette variable outside of the callback, you can also use it to later
     * get the index of palette colors while processing data.
     *
     * @param {Callback<Palette>} listener
     *
     * @memberof PngPong
     */
    PngPong.prototype.onPalette = function (listener) {
        this.paletteListeners.push(listener);
    };
    /**
     * Add a callback that will be run multiple times as PngPong runs through
     * the image data.
     *
     * @param {DataCallback} listener
     *
     * @memberof PngPong
     */
    PngPong.prototype.onData = function (listener) {
        this.dataListeners.push(listener);
    };
    return PngPong;
}();
exports.PngPong = PngPong;
//# sourceMappingURL=png-pong.js.map