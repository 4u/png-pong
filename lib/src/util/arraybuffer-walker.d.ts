/**
 * A class that "walks" through an ArrayBuffer, either reading or writing
 * values as it goes. Intended as a less performance-draining alternative
 * to a DataView.
 *
 * @export
 * @class ArrayBufferWalker
 */
export declare class ArrayBufferWalker {
    private bufferOrLength;
    /**
     * The current index our walker is sat at. Can be modified.
     *
     * @memberof ArrayBufferWalker
     */
    offset: number;
    array: Uint8Array;
    /**
     * Creates an instance of ArrayBufferWalker.
     * @param {(ArrayBuffer | number)} bufferOrLength - either an existing ArrayBuffer
     * or the length of a new array you want to use.
     *
     * @memberof ArrayBufferWalker
     */
    constructor(bufferOrLength: ArrayBuffer | number);
    writeUint32(value: any, littleEndian?: boolean): void;
    writeUint16(value: any, littleEndian?: boolean): void;
    writeUint8(value: any): void;
    writeString(value: any): void;
    readUint32(littleEndian?: boolean): number;
    readUint16(littleEndian?: boolean): number;
    readUint8(): number;
    readString(length: any): string;
    /**
     * Move around the array without writing or reading a value.
     *
     * @param {any} length
     *
     * @memberof ArrayBufferWalker
     */
    skip(length: any): void;
    rewindUint32(): void;
    rewindString(length: any): void;
    private crcStartOffset?;
    /**
     * Mark the beginning of an area we want to calculate the CRC for.
     *
     * @memberof ArrayBufferWalker
     */
    startCRC(): void;
    /**
     * After using .startCRC() to mark the start of a block, use this to mark the
     * end of the block and write the UInt32 CRC value.
     *
     * @memberof ArrayBufferWalker
     */
    writeCRC(): void;
    private adlerStartOffset?;
    private savedAdlerValue?;
    /**
     * Similar to .startCRC(), this marks the start of a block we want to calculate the
     * ADLER32 checksum of.
     *
     * @memberof ArrayBufferWalker
     */
    startAdler(): void;
    /**
     * ADLER32 is used in our ZLib blocks, but can span across multiple blocks. So sometimes
     * we need to pause it in order to start a new block.
     *
     * @memberof ArrayBufferWalker
     */
    pauseAdler(): void;
    /**
     * Similar to .writeCRC(), this marks the end of an ADLER32 checksummed block, and
     * writes the Uint32 checksum value to the ArrayBuffer.
     *
     * @returns
     *
     * @memberof ArrayBufferWalker
     */
    writeAdler(): void;
}
