"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PRE_HEADER = '\x89PNG\r\n\x1A\n';
/**
 * PNG files have a very basic header that identifies the PNG
 * file as... a PNG file. We need to write that out.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 */
function writePreheader(walker) {
    walker.writeString(PRE_HEADER);
}
exports.writePreheader = writePreheader;
/**
 * Make sure that we're dealing with a PNG file. Throws an error
 * if the file does not start with the standard PNG header.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 */
function checkPreheader(walker) {
    var value = walker.readString(PRE_HEADER.length);
    if (value !== PRE_HEADER) {
        throw new Error("Buffer does not have a PNG file header.");
    }
}
exports.checkPreheader = checkPreheader;
exports.length = PRE_HEADER.length;
//# sourceMappingURL=pre-header.js.map