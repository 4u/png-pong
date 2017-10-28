"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var crc_1 = require("./crc");
var adler_1 = require("./adler");
function swap16(val) {
    return (val & 0xFF) << 8 | val >> 8 & 0xFF;
}
function swap32(val) {
    return (val & 0xFF) << 24 | (val & 0xFF00) << 8 | val >> 8 & 0xFF00 | val >> 24 & 0xFF;
}
/**
 * A class that "walks" through an ArrayBuffer, either reading or writing
 * values as it goes. Intended as a less performance-draining alternative
 * to a DataView.
 *
 * @export
 * @class ArrayBufferWalker
 */
var ArrayBufferWalker = /** @class */function () {
    /**
     * Creates an instance of ArrayBufferWalker.
     * @param {(ArrayBuffer | number)} bufferOrLength - either an existing ArrayBuffer
     * or the length of a new array you want to use.
     *
     * @memberof ArrayBufferWalker
     */
    function ArrayBufferWalker(bufferOrLength) {
        this.bufferOrLength = bufferOrLength;
        /**
         * The current index our walker is sat at. Can be modified.
         *
         * @memberof ArrayBufferWalker
         */
        this.offset = 0;
        if (bufferOrLength instanceof ArrayBuffer) {
            this.array = new Uint8Array(bufferOrLength);
        } else {
            this.array = new Uint8Array(bufferOrLength);
        }
    }
    ArrayBufferWalker.prototype.writeUint32 = function (value, littleEndian) {
        if (littleEndian === void 0) {
            littleEndian = false;
        }
        if (littleEndian) {
            value = swap32(value);
        }
        this.array[this.offset++] = value >> 24 & 255;
        this.array[this.offset++] = value >> 16 & 255;
        this.array[this.offset++] = value >> 8 & 255;
        this.array[this.offset++] = value & 255;
    };
    ArrayBufferWalker.prototype.writeUint16 = function (value, littleEndian) {
        if (littleEndian === void 0) {
            littleEndian = false;
        }
        if (littleEndian) {
            value = swap16(value);
        }
        this.array[this.offset++] = value >> 8 & 255;
        this.array[this.offset++] = value & 255;
    };
    ArrayBufferWalker.prototype.writeUint8 = function (value) {
        this.array[this.offset++] = value & 255;
    };
    ArrayBufferWalker.prototype.writeString = function (value) {
        for (var i = 0, n = value.length; i < n; i++) {
            this.array[this.offset++] = value.charCodeAt(i);
        }
    };
    ArrayBufferWalker.prototype.readUint32 = function (littleEndian) {
        if (littleEndian === void 0) {
            littleEndian = false;
        }
        var val = this.array[this.offset++] << 24;
        val += this.array[this.offset++] << 16;
        val += this.array[this.offset++] << 8;
        val += this.array[this.offset++] & 255;
        return littleEndian ? swap32(val) : val;
    };
    ArrayBufferWalker.prototype.readUint16 = function (littleEndian) {
        if (littleEndian === void 0) {
            littleEndian = false;
        }
        var val = this.array[this.offset++] << 8;
        val += this.array[this.offset++] & 255;
        return littleEndian ? swap16(val) : val;
    };
    ArrayBufferWalker.prototype.readUint8 = function () {
        return this.array[this.offset++] & 255;
    };
    ArrayBufferWalker.prototype.readString = function (length) {
        var result = "";
        var target = this.offset + length;
        while (this.offset < target) {
            result += String.fromCharCode(this.array[this.offset++]);
        }
        return result;
    };
    /**
     * Move around the array without writing or reading a value.
     *
     * @param {any} length
     *
     * @memberof ArrayBufferWalker
     */
    ArrayBufferWalker.prototype.skip = function (length) {
        this.offset += length;
    };
    ArrayBufferWalker.prototype.rewindUint32 = function () {
        this.offset -= 4;
    };
    ArrayBufferWalker.prototype.rewindString = function (length) {
        this.offset -= length;
    };
    /**
     * Mark the beginning of an area we want to calculate the CRC for.
     *
     * @memberof ArrayBufferWalker
     */
    ArrayBufferWalker.prototype.startCRC = function () {
        if (this.crcStartOffset) {
            throw new Error("CRC already started");
        }
        this.crcStartOffset = this.offset;
    };
    /**
     * After using .startCRC() to mark the start of a block, use this to mark the
     * end of the block and write the UInt32 CRC value.
     *
     * @memberof ArrayBufferWalker
     */
    ArrayBufferWalker.prototype.writeCRC = function () {
        if (this.crcStartOffset === undefined) {
            throw new Error("CRC has not been started, cannot write");
        }
        var crc = crc_1.crc32(this.array, this.crcStartOffset, this.offset - this.crcStartOffset);
        this.crcStartOffset = undefined;
        this.writeUint32(crc);
    };
    /**
     * Similar to .startCRC(), this marks the start of a block we want to calculate the
     * ADLER32 checksum of.
     *
     * @memberof ArrayBufferWalker
     */
    ArrayBufferWalker.prototype.startAdler = function () {
        if (this.adlerStartOffset) {
            throw new Error("Adler already started");
        }
        this.adlerStartOffset = this.offset;
    };
    /**
     * ADLER32 is used in our ZLib blocks, but can span across multiple blocks. So sometimes
     * we need to pause it in order to start a new block.
     *
     * @memberof ArrayBufferWalker
     */
    ArrayBufferWalker.prototype.pauseAdler = function () {
        if (this.adlerStartOffset === undefined) {
            throw new Error("Adler has not been started, cannot pause");
        }
        this.savedAdlerValue = adler_1.adler32_buf(this.array, this.adlerStartOffset, this.offset - this.adlerStartOffset, this.savedAdlerValue);
        this.adlerStartOffset = undefined;
    };
    /**
     * Similar to .writeCRC(), this marks the end of an ADLER32 checksummed block, and
     * writes the Uint32 checksum value to the ArrayBuffer.
     *
     * @returns
     *
     * @memberof ArrayBufferWalker
     */
    ArrayBufferWalker.prototype.writeAdler = function () {
        if (this.adlerStartOffset === undefined && this.savedAdlerValue === undefined) {
            throw new Error("CRC has not been started, cannot write");
        }
        if (this.adlerStartOffset === undefined) {
            this.writeUint32(this.savedAdlerValue);
            this.savedAdlerValue = undefined;
            return;
        }
        var adler = adler_1.adler32_buf(this.array, this.adlerStartOffset, this.offset - this.adlerStartOffset, this.savedAdlerValue);
        this.adlerStartOffset = undefined;
        this.writeUint32(adler);
    };
    return ArrayBufferWalker;
}();
exports.ArrayBufferWalker = ArrayBufferWalker;
//# sourceMappingURL=arraybuffer-walker.js.map