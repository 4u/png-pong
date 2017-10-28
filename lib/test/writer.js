"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var writer_1 = require("../src/writer");
describe("PNG Writer", function () {
    it("Should write a valid PNG file from RGBA array", function (done) {
        var rgbaArray = new Uint8ClampedArray(300 * 200 * 4);
        for (var i = 0; i < rgbaArray.length; i = i + 4) {
            rgbaArray[i] = 255;
            rgbaArray[i + 3] = 100;
        }
        var buffer = writer_1.createFromRGBAArray(300, 200, rgbaArray);
        var nodeBuffer = new Buffer(new Uint8Array(buffer));
        var fs = require('fs');
        var exec = require('child_process').exec;
        fs.writeFileSync('/tmp/test.png', nodeBuffer);
        var pngcheck = exec("pngcheck -vv /tmp/test.png", function (err, stdout, stderr) {
            if (err) {
                done(new Error(stdout));
            } else {
                // console.log(stdout)
                done();
            }
        });
    });
    it("Should write a valid PNG file from metadata", function (done) {
        var buffer = writer_1.createWithMetadata(300, 200, 2, [255, 0, 0]);
        var nodeBuffer = new Buffer(new Uint8Array(buffer));
        var fs = require('fs');
        var exec = require('child_process').exec;
        fs.writeFileSync('/tmp/test-red.png', nodeBuffer);
        var pngcheck = exec("pngcheck -vv /tmp/test.png", function (err, stdout, stderr) {
            if (err) {
                done(new Error(stdout));
            } else {
                // console.log(stdout)
                done();
            }
        });
    });
});
//# sourceMappingURL=writer.js.map