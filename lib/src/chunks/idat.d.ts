import { ArrayBufferWalker } from '../util/arraybuffer-walker';
/**
 * Write an IDAT chunk all at once. Typically used when creating a new blank image.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {Uint8ClampedArray} data
 * @param {number} width
 */
export declare function writeIDAT(walker: ArrayBufferWalker, data: Uint8ClampedArray, width: number): void;
/**
 * Write an IDAT chunk without wasting memory on a source ArrayBuffer - if we want it all to be one
 * palette index.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {number} value - The palette index we want all the pixels to be
 * @param {number} width
 * @param {number} height
 */
export declare function writeIDATConstant(walker: ArrayBufferWalker, value: number, width: number, height: number): void;
/**
 * Calculate the length of an IDAT chunk. Because it uses both ZLib chunking
 * and a row filter byte at the start of each row, it isn't as simple as
 * width * height.
 *
 * @export
 * @param {number} width
 * @param {number} height
 * @returns
 */
export declare function calculateIDATLength(width: number, height: number): number;
