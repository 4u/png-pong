"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function str2ab(str) {
    var bufView = new Uint8Array(str.length);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}
exports.str2ab = str2ab;
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
exports.ab2str = ab2str;
//# sourceMappingURL=string-arraybuffer.js.map