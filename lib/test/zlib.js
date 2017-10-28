"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var zlib = require("zlib");
var zlib_1 = require("../src/util/zlib");
var arraybuffer_walker_1 = require("../src/util/arraybuffer-walker");
var expect = require("expect");
describe("Zlib writer", function () {
    it("Should output a buffer readable by the Node ZLib library", function () {
        var length = 120000;
        var arr = new ArrayBuffer(zlib_1.calculateZlibbedLength(length));
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(arr);
        var zlibWriter = new zlib_1.ZlibWriter(writer, length);
        for (var i = 0; i < length; i++) {
            zlibWriter.writeUint8(i % 3 === 0 ? 1 : 0);
        }
        zlibWriter.end();
        var toNodeBuffer = new Buffer(new Uint8Array(arr));
        var inflatedAgain = zlib.inflateSync(toNodeBuffer);
        expect(inflatedAgain.length).toEqual(length);
        var outArray = new Uint8Array(inflatedAgain);
        for (var i = 0; i < length; i++) {
            expect(outArray[i]).toEqual(i % 3 === 0 ? 1 : 0);
        }
    });
    it("Read same size as written", function () {
        var length = 120000;
        var arr = new ArrayBuffer(zlib_1.calculateZlibbedLength(length));
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(arr);
        var zlibWriter = new zlib_1.ZlibWriter(writer, length);
        for (var i = 0; i < length; i++) {
            zlibWriter.writeUint8(i % 2 === 0 ? 2 : 4);
        }
        zlibWriter.end();
        var toNodeBuffer = new Buffer(new Uint8Array(arr));
        // require('fs').writeFileSync('/tmp/zlibbed', toNodeBuffer)
        writer.offset = 0;
        var readLength = 0;
        zlib_1.readZlib(writer, function (arr, readOffset, dataOffset, length) {
            for (var i = 0; i < length; i++) {
                try {
                    expect(arr[readOffset + i]).toEqual((dataOffset + i) % 2 === 0 ? 2 : 4);
                } catch (err) {
                    console.log("Failed at index #" + readLength, readOffset + i, dataOffset + i);
                    throw err;
                }
                readLength++;
            }
        });
        expect(readLength).toEqual(120000);
    });
});
//# sourceMappingURL=zlib.js.map