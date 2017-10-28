import { PngPong } from '../';
import { RGB } from '../util/color-types';
/**
 * If you want to replace all of the RGB values in the source image with
 * a mask color and just use alpha values, you must provide both the
 * color you want to draw and the background color you want to multiply
 * the alpha with.
 *
 * @export
 * @interface ColorMaskOptions
 */
export interface ColorMaskOptions {
    maskColor: RGB;
    backgroundColor: RGB;
}
/**
 * A transformer to copy one or more sections of an image onto another.
 *
 * @export
 * @class PngPongImageCopyTransformer
 */
export declare class PngPongImageCopyTransformer {
    private sourceImage;
    private targetTransformer;
    private operations;
    /**
     * Creates an instance of PngPongImageCopyTransformer.
     * @param {ArrayBuffer} sourceImage - the source PNG ArrayBuffer to read from. Must be
     * a PngPong suitable PNG.
     * @param {PngPong} targetTransformer - the transformer to add this image to.
     *
     * @memberof PngPongImageCopyTransformer
     */
    constructor(sourceImage: ArrayBuffer, targetTransformer: PngPong);
    /**
     * Add a copy operation to the transformer. Must be done before running PngPong.run().
     *
     * @param {number} sourceX
     * @param {number} sourceY
     * @param {number} sourceWidth
     * @param {number} sourceHeight
     * @param {number} targetX
     * @param {number} targetY
     * @param {ColorMaskOptions} [mask] - Optional argument to ignore the RGB value of the source image
     * and instead apply a color mask.
     *
     * @memberof PngPongImageCopyTransformer
     */
    copy(sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, targetX: number, targetY: number, mask?: ColorMaskOptions): void;
    private onPalette(targetPalette);
    private onData(array, readOffset, x, y, length);
}
