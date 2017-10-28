import { PngPong } from '../';
import { RGB } from '../util/color-types';
/**
 * A transformer to draw basic shapes onto an image. Currently only draws rectangles.
 *
 * @export
 * @class PngPongShapeTransformer
 */
export declare class PngPongShapeTransformer {
    private baseTransformer;
    private operations;
    private operationPaletteIndexes;
    private imageWidth;
    /**
     * Creates an instance of PngPongShapeTransformer.
     * @param {PngPong} baseTransformer - the transformer you want to draw onto.
     *
     * @memberof PngPongShapeTransformer
     */
    constructor(baseTransformer: PngPong);
    private onPalette(palette);
    private onData(array, readOffset, x, y, length);
    /**
     * Add a rectangle to the list of draw operations. Must use this before running PngPong.run()
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {RGB} color
     *
     * @memberof PngPongShapeTransformer
     */
    drawRect(x: number, y: number, width: number, height: number, color: RGB): void;
}
