import { ArrayBufferWalker } from '../util/arraybuffer-walker';
/**
 * PNG files have a very basic header that identifies the PNG
 * file as... a PNG file. We need to write that out.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 */
export declare function writePreheader(walker: ArrayBufferWalker): void;
/**
 * Make sure that we're dealing with a PNG file. Throws an error
 * if the file does not start with the standard PNG header.
 *
 * @export
 * @param {ArrayBufferWalker} walker
 */
export declare function checkPreheader(walker: ArrayBufferWalker): void;
export declare const length: number;
