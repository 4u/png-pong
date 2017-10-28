"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
var blank_png_1 = require("../util/blank-png");
var pngjs_1 = require("pngjs");
var expect = require("expect");
describe("Image Copier", function () {
    it("should copy an image successfully", function (done) {
        var sourcePNG = blank_png_1.createBlankPNG(20, 20, [255, 0, 0]);
        var targetPNG = blank_png_1.createBlankPNG(60, 60, [255, 255, 255], 1);
        var transformer = new src_1.PngPong(targetPNG);
        var imageCopier = new src_1.PngPongImageCopyTransformer(sourcePNG, transformer);
        imageCopier.copy(5, 5, 15, 15, 10, 10);
        transformer.run();
        // let b = new Buffer(new Uint8Array(targetPNG));
        // require('fs').writeFileSync('/tmp/copy-out.png', b);
        var arr = new Uint8Array(targetPNG);
        var buff = new Buffer(arr);
        new pngjs_1.PNG({ filterType: 4 }).parse(buff, function (err, png) {
            var resultArray = new Uint8Array(png.data);
            expect(resultArray[0]).toEqual(255);
            expect(resultArray[1]).toEqual(255);
            expect(resultArray[2]).toEqual(255);
            var imageStart = (60 * 10 + 10) * 4;
            expect(resultArray[imageStart]).toEqual(255);
            expect(resultArray[imageStart + 1]).toEqual(0);
            expect(resultArray[imageStart + 2]).toEqual(0);
            done();
        });
    });
});
//# sourceMappingURL=copy-image.js.map