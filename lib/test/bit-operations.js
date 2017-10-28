"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var arraybuffer_walker_1 = require("../src/util/arraybuffer-walker");
var expect = require("expect");
var crc_1 = require("../src/util/crc");
var adler_1 = require("../src/util/adler");
describe("Bit Operations", function () {
    it("should write and read uint32 big-endian", function () {
        var buff = new ArrayBuffer(4);
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        writer.writeUint32(3000);
        var dv = new DataView(buff);
        expect(dv.getUint32(0)).toEqual(3000);
        var reader = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        expect(reader.readUint32()).toEqual(3000);
    });
    it("should write and read uint32 little-endian", function () {
        var buff = new ArrayBuffer(4);
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        writer.writeUint32(3000, true);
        var dv = new DataView(buff);
        expect(dv.getUint32(0, true)).toEqual(3000);
        var reader = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        expect(reader.readUint32(true)).toEqual(3000);
    });
    it("should write and read uint8", function () {
        var buff = new ArrayBuffer(2);
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        writer.writeUint8(125);
        var array = new Uint8Array(buff);
        expect(array[0]).toEqual(125);
        var reader = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        var value = reader.readUint8();
        expect(value).toEqual(125);
    });
    it("should write and read uint16 big-endian", function () {
        var buff = new ArrayBuffer(4);
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        writer.writeUint16(65533);
        var dv = new DataView(buff);
        expect(dv.getUint16(0, false)).toEqual(65533);
        var reader = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        expect(reader.readUint16()).toEqual(65533);
    });
    it("should write and read uint16 little-endian", function () {
        var buff = new ArrayBuffer(4);
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        writer.writeUint16(65533, true);
        var dv = new DataView(buff);
        expect(dv.getUint16(0, true)).toEqual(65533);
        var reader = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        expect(reader.readUint16(true)).toEqual(65533);
    });
    it("should write and read strings", function () {
        var buff = new ArrayBuffer(5);
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        writer.writeString("Hello");
        var reader = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        var value = reader.readString(5);
        expect(value).toEqual("Hello");
    });
    it("should combine operations successfully", function () {
        var buff = new ArrayBuffer(4 + 2 + 5);
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        writer.writeString("Hello");
        writer.writeUint32(2465);
        writer.writeUint8(255);
        var reader = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        expect(reader.readString(5)).toEqual("Hello");
        expect(reader.readUint32()).toEqual(2465);
        expect(reader.readUint8()).toEqual(255);
    });
    it("should save CRCs correctly", function () {
        var buff = new ArrayBuffer(8);
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        var reader = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        writer.startCRC();
        writer.writeUint32(3000);
        writer.writeCRC();
        expect(writer.offset).toEqual(8);
        reader.offset = 4;
        var crc = reader.readUint32();
        var checkCRC = crc_1.crc32(new Uint8Array(buff), 0, 4);
        expect(crc).toEqual(checkCRC);
    });
    it("should save Adlers correctly", function () {
        var buff = new ArrayBuffer(8);
        var writer = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        var reader = new arraybuffer_walker_1.ArrayBufferWalker(buff);
        writer.startAdler();
        writer.writeUint32(3000);
        writer.writeAdler();
        expect(writer.offset).toEqual(8);
        reader.offset = 4;
        var adler = reader.readUint32();
        var checkAdler = adler_1.adler32_buf(new Uint8Array(buff), 0, 4);
        expect(adler).toEqual(checkAdler);
    });
});
//# sourceMappingURL=bit-operations.js.map