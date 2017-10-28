"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var identifier = "IEND";
/**
 * There is no actual content in an IEND chunk, just the identifier
 * and CRC.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 */
function writeIEND(walker) {
    walker.writeUint32(0);
    walker.startCRC();
    walker.writeString(identifier);
    walker.writeCRC();
}
exports.writeIEND = writeIEND;
exports.length = identifier.length // identifier
+ 4 // CRC
+ 4; // length
//# sourceMappingURL=iend.js.map