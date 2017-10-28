/**
 * Calculate the ADLER32 checksum of a section of a buffer. Code largely taken from:
 * https://github.com/SheetJS/js-adler32
 *
 * @export
 * @param {(Uint8Array | Uint8ClampedArray)} buf
 * @param {number} offset
 * @param {number} length
 * @param {number} [seed]
 * @returns
 */
export declare function adler32_buf(buf: Uint8Array | Uint8ClampedArray, offset: number, length: number, seed?: number): number;
