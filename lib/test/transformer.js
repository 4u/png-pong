"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var blank_png_1 = require("./util/blank-png");
var ihdr_1 = require("../src/chunks/ihdr");
var expect = require("expect");
var pngjs_1 = require("pngjs");
describe("PNG Transformer", function () {
    it("should successfully parse a PNG header", function (done) {
        var source = blank_png_1.createBlankPNG(200, 200, [255, 0, 0]);
        var transformer = new src_1.PngPong(source);
        transformer.onHeader(function (header) {
            expect(header.width).toEqual(200);
            expect(header.height).toEqual(200);
            expect(header.bitDepth).toEqual(8);
            expect(header.colorType).toEqual(ihdr_1.PNGColorType.Palette);
            done();
        });
        transformer.run();
    });
    it("should successfully parse a PNG palette", function (done) {
        var source = blank_png_1.createBlankPNG(200, 200, [255, 0, 0, 100]);
        var transformer = new src_1.PngPong(source);
        transformer.onPalette(function (palette) {
            var getIndex = palette.getColorIndex([255, 0, 0, 100]);
            expect(getIndex).toEqual(1);
            done();
        });
        transformer.run();
    });
    it("should successfully write to a PNG palette", function (done) {
        var source = blank_png_1.createBlankPNG(200, 200, [255, 0, 0, 100], 1);
        var transformer = new src_1.PngPong(source);
        transformer.onPalette(function (palette) {
            var newIndex = palette.addColor([0, 255, 0]);
            expect(newIndex).toEqual(2);
            var check = palette.getColorIndex([0, 255, 0]);
            expect(check).toEqual(newIndex);
            done();
        });
        transformer.run();
    });
    it("should emit data events", function (done) {
        var source = blank_png_1.createBlankPNG(200, 200, [255, 0, 0, 100]);
        var transformer = new src_1.PngPong(source);
        var numRowsEmitted = 0;
        transformer.onData(function (array, readOffset, dataOffset, length) {
            numRowsEmitted++;
            if (numRowsEmitted === 200) {
                done();
            }
        });
        transformer.run();
    });
    it("should transform an image and the PNG still be valid", function (done) {
        var source = blank_png_1.createBlankPNG(20, 20, [255, 0, 0], 1);
        var transformer = new src_1.PngPong(source);
        var colorIndex = -1;
        transformer.onPalette(function (palette) {
            colorIndex = palette.addColor([0, 255, 0]);
        });
        transformer.onData(function (arr, readOffset, dataOffset, length) {
            for (var i = readOffset; i < readOffset + length; i++) {
                arr[i] = colorIndex;
            }
        });
        transformer.run();
        var asBuffer = new Buffer(new Uint8Array(source));
        new pngjs_1.PNG().parse(asBuffer, function (err, data) {
            // console.log(err, data)
            done(err);
        });
    });
});
//# sourceMappingURL=transformer.js.map