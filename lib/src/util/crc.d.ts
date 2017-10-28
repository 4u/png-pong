/**
 * Calculate the CRC value of a selected slice of an ArrayBuffer. Code from:
 * https://github.com/alexgorbatchev/node-crc/blob/master/src/crc32.js
 *
 * @export
 * @param {(Uint8Array | Uint8ClampedArray)} buf
 * @param {number} offset
 * @param {number} length
 * @param {number} [previous]
 * @returns {number}
 */
export declare function crc32(buf: Uint8Array | Uint8ClampedArray, offset: number, length: number, previous?: number): number;
