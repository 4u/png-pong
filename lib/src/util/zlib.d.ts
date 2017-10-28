import { ArrayBufferWalker } from './arraybuffer-walker';
export declare const ZLIB_WINDOW_SIZE: number;
export declare const BLOCK_SIZE = 65535;
/**
 * Zlibbed data takes up more space than the raw data itself - we aren't
 * compressing it but we do need to add block headers and the like.
 *
 * @export
 * @param {number} dataLength
 * @returns
 */
export declare function calculateZlibbedLength(dataLength: number): number;
/**
 * Our tool for writing IDAT chunks. Although Zlib is used for compression,
 * we aren't compressing anything here. Basically, this writes a Zlib chunk
 * as if it is set to a compression level of 0.
 *
 * @export
 * @class ZlibWriter
 */
export declare class ZlibWriter {
    private walker;
    bytesLeftInWindow: number;
    bytesLeft: number;
    constructor(walker: ArrayBufferWalker, dataLength: number);
    writeZlibHeader(): void;
    startBlock(): void;
    writeUint8(val: number): void;
    end(): void;
}
export declare type ZlibReadCallback = (array: Uint8Array, readOffset: number, dataOffset: number, length: number) => void;
/**
 * Utility function to parse out a Zlib-encoded block (at a compression level of 0 only). Will
 * skip over Zlib headers and block markers, and call the dataCallback repeatedly when actual
 * data is available.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 * @param {ZlibReadCallback} dataCallback
 */
export declare function readZlib(walker: ArrayBufferWalker, dataCallback: ZlibReadCallback): void;
