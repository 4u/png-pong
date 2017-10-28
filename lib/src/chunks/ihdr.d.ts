import { ArrayBufferWalker } from '../util/arraybuffer-walker';
export declare type validBitDepth = 1 | 2 | 4 | 8 | 16;
/**
 * The color type our image uses. PngPong currently only supports
 * Palette images, PNGColorType.Palette
 *
 * @export
 * @enum {number}
 */
export declare enum PNGColorType {
    Grayscale = 0,
    RGB = 2,
    Palette = 3,
    GrayscaleWithAlpha = 4,
    RGBA = 6,
}
/**
 * The attributes for an IHDR chunk as defined in
 * http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html#C.IHDR
 *
 * @export
 * @interface IHDROptions
 */
export interface IHDROptions {
    width: number;
    height: number;
    bitDepth: validBitDepth;
    colorType: PNGColorType;
    compressionMethod: number;
    filter: number;
    interface: number;
}
export declare function writeIHDR(walker: ArrayBufferWalker, options: IHDROptions): void;
/**
 * Read out the values contained within IHDR. Does not let you edit these
 * values, as changing pretty much any of them would make the IDAT chunk
 * totally invalid.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {number} length
 * @returns {IHDROptions}
 */
export declare function readIHDR(walker: ArrayBufferWalker, length: number): IHDROptions;
/**
 *  IHDR length is always 13 bytes. So we can store this as a constant.
 */
export declare const IHDRLength: number;
