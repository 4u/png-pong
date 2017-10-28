import { ArrayBufferWalker } from '../util/arraybuffer-walker';
import { RGBA, RGB } from '../util/color-types';
/**
 * Write both the PLTE and tRNS chunks of the PNG file.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {Uint8ClampedArray} rgbPalette
 * @param {Uint8ClampedArray} alphaPalette
 */
export declare function writePalette(walker: ArrayBufferWalker, rgbPalette: Uint8ClampedArray, alphaPalette: Uint8ClampedArray): void;
/**
 * Testing showed that creating new UInt8Arrays was an expensive process, so instead
 * of slicing the array to mark the PLTE and tRNS arrays, we instead store their
 * offset and length.
 *
 * @export
 * @interface OffsetAndLength
 */
export interface OffsetAndLength {
    offset: number;
    length: number;
}
/**
 * A manager that handles both the PLTE and tRNS chunks, as they depend upon each other.
 *
 * @export
 * @class Palette
 */
export declare class Palette {
    private walker;
    private rgbPalette;
    private alphaPalette;
    constructor(walker: ArrayBufferWalker, rgbPalette: OffsetAndLength, alphaPalette?: OffsetAndLength | undefined);
    writeCRCs(): void;
    private checkColor(rgba);
    /**
     * Return the RGBA color at the index provided. If there is no tRNS chunk the
     * color will always have an alpha value of 255.
     *
     * @param {number} idx
     * @returns The RGBA color at this index. If the color hasn't been specified it
     * will come back as [0,0,0,255].
     *
     * @memberof Palette
     */
    getColorAtIndex(idx: number): [number, number, number, number];
    /**
     * Get the palette index for an existing color.
     *
     * @param {RGBA} rgba
     * @param {number} [startingIndex=0] - used internally to skip the first palette entry, which is always rgba(0,0,0,0)
     * @returns The index of the color, or -1 if the color has not yet been added to the palette.
     *
     * @memberof Palette
     */
    getColorIndex(rgba: RGBA | RGB, startingIndex?: number): number;
    /**
     * Add a color to the palette. Must be an RGBA color, even if we're not using tRNS (to do: fix that)
     *
     * @param {RGBA} rgba
     * @returns the index the color was added at.
     *
     * @memberof Palette
     */
    addColor(rgba: RGBA | RGB): number;
}
/**
 * Take an ArrayWalker and parse out the PLTE chunk and, if it exists, the tRNS chunk.
 * If it exists, the tRNS chunk MUST immediately follow the PLTE chunk.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {number} length
 * @returns
 */
export declare function readPalette(walker: ArrayBufferWalker, length: number): Palette;
/**
 * PNG files can have palettes of varying sizes, up to 256 colors. If we want
 * to try to save some space, we can use a smaller palette.
 *
 * @export
 * @param {number} numColors
 * @returns
 */
export declare function calculatePaletteLength(numColors: number): number;
