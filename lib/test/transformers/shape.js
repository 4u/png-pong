"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
var blank_png_1 = require("../util/blank-png");
var pngjs_1 = require("pngjs");
var expect = require("expect");
describe("Shape transformer", function () {
    it("should draw a rectangle", function (done) {
        var png = blank_png_1.createBlankPNG(400, 200, [255, 255, 255, 255], 1);
        var transformer = new src_1.PngPong(png);
        var shape = new src_1.PngPongShapeTransformer(transformer);
        shape.drawRect(10, 10, 20, 20, [255, 0, 0]);
        shape.drawRect(10, 160, 10, 10, [255, 0, 0]);
        transformer.run();
        var arr = new Uint8Array(png);
        var buff = new Buffer(arr);
        var b = new Buffer(new Uint8Array(png));
        require('fs').writeFileSync('/tmp/shape-out.png', b);
        new pngjs_1.PNG({ filterType: 4 }).parse(buff, function (err, png) {
            var resultArray = new Uint8Array(png.data);
            expect(resultArray[0]).toEqual(255);
            expect(resultArray[1]).toEqual(255);
            expect(resultArray[2]).toEqual(255);
            var squareStart = (400 * 10 + 10) * 4;
            expect(resultArray[squareStart]).toEqual(255);
            expect(resultArray[squareStart + 1]).toEqual(0);
            expect(resultArray[squareStart + 2]).toEqual(0);
            expect(resultArray[squareStart + 4]).toEqual(255);
            expect(resultArray[squareStart + 5]).toEqual(0);
            expect(resultArray[squareStart + 6]).toEqual(0);
            var squareEnd = (400 * 29 + 29) * 4;
            expect(resultArray[squareEnd]).toEqual(255);
            expect(resultArray[squareEnd + 1]).toEqual(0);
            expect(resultArray[squareEnd + 2]).toEqual(0);
            expect(resultArray[squareEnd + 4]).toEqual(255);
            expect(resultArray[squareEnd + 5]).toEqual(255);
            expect(resultArray[squareEnd + 6]).toEqual(255);
            var secondSquareStart = (400 * 160 + 10) * 4;
            expect(resultArray[secondSquareStart]).toEqual(255);
            expect(resultArray[secondSquareStart + 1]).toEqual(0);
            expect(resultArray[secondSquareStart + 2]).toEqual(0);
            var secondSquareEnd = (400 * 169 + 19) * 4;
            expect(resultArray[secondSquareEnd]).toEqual(255);
            expect(resultArray[secondSquareEnd + 1]).toEqual(0);
            expect(resultArray[secondSquareEnd + 2]).toEqual(0);
            expect(resultArray[secondSquareEnd + 4]).toEqual(255);
            expect(resultArray[secondSquareEnd + 5]).toEqual(255);
            expect(resultArray[secondSquareEnd + 6]).toEqual(255);
            done();
        });
    });
});
//# sourceMappingURL=shape.js.map