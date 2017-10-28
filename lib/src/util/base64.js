"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Quick function to convert a string to Base64, that works in both
 * Node and the browser
 *
 * @export
 * @param {string} str
 * @returns
 */
function toBase64(str) {
    if (typeof btoa === "undefined") {
        return new Buffer(str, 'binary').toString('base64');
    } else {
        return btoa(str);
    }
}
exports.toBase64 = toBase64;
/**
 * Quick function to convert from Base64, works in both Node and browser.
 *
 * @export
 * @param {string} str
 * @returns
 */
function fromBase64(str) {
    if (typeof atob === "undefined") {
        return new Buffer(str, 'base64').toString('binary');
    } else {
        return atob(str);
    }
}
exports.fromBase64 = fromBase64;
//# sourceMappingURL=base64.js.map