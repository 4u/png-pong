import { ArrayBufferWalker } from '../util/arraybuffer-walker';
/**
 * There is no actual content in an IEND chunk, just the identifier
 * and CRC.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 */
export declare function writeIEND(walker: ArrayBufferWalker): void;
export declare const length: number;
