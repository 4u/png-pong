import { RGB } from './util/color-types';
/**
 * Create a PngPong-suitable PNG ArrayBuffer from an existing RGBA array. Combine
 * this with PNGJS to transform an existing PNG image into something PngPong can use.
 *
 * @export
 * @param {number} width
 * @param {number} height
 * @param {Uint8ClampedArray} rgbaData
 * @param {number} extraPaletteSpaces - How many extra palette entries should we make available for new colors, after we've added the colors from the existing array?
 * @returns
 */
export declare function createFromRGBAArray(width: number, height: number, rgbaData: Uint8ClampedArray, extraPaletteSpaces?: number): ArrayBuffer;
/**
 * Create a PngPong-suitable ArrayBuffer based on the arguments provided.
 *
 * @export
 * @param {number} width
 * @param {number} height
 * @param {number} paletteSize - Must be at least 1, and at least 2 if specifying a background color.
 * @param {RGB} [backgroundColor]
 * @returns
 */
export declare function createWithMetadata(width: number, height: number, paletteSize: number, backgroundColor?: RGB): ArrayBuffer;
