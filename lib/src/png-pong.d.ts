import { IHDROptions } from './chunks/ihdr';
import { Palette } from './chunks/palette';
import { DataCallback } from './util/data-callback';
export declare type Callback<T> = (arg: T) => void;
/**
 * The core class for any image manipulation. Create an instance of this class
 * with the ArrayBuffer of your original PNG image, then apply your transforms
 * to it. Then execute PngPng.run() to apply those transforms.
 *
 * @export
 * @class PngPong
 */
export declare class PngPong {
    private source;
    private walker;
    private headerListeners;
    private paletteListeners;
    private dataListeners;
    private width;
    /**
     * Creates an instance of PngPong.
     * @param {ArrayBuffer} source: The ArrayBuffer you want to apply
     * transforms to.
     *
     * @memberof PngPong
     */
    constructor(source: ArrayBuffer);
    private readData(dataLength);
    private readChunk();
    /**
     * Apply the transforms you've created to the original ArrayBuffer.
     *
     * @memberof PngPong
     */
    run(): void;
    /**
     * Add a callback to be run when the IHDR chunk of the PNG file has been
     * successfully read. You cannot edit the contents of the IHDR, but can
     * read values out of it.
     *
     * @param {Callback<IHDROptions>} listener
     *
     * @memberof PngPong
     */
    onHeader(listener: Callback<IHDROptions>): void;
    /**
     * Add a callback when the image palette has been processed. During this
     * callback you are able to add colors to the palette. If you save the
     * palette variable outside of the callback, you can also use it to later
     * get the index of palette colors while processing data.
     *
     * @param {Callback<Palette>} listener
     *
     * @memberof PngPong
     */
    onPalette(listener: Callback<Palette>): void;
    /**
     * Add a callback that will be run multiple times as PngPong runs through
     * the image data.
     *
     * @param {DataCallback} listener
     *
     * @memberof PngPong
     */
    onData(listener: DataCallback): void;
}
