export interface PalettedArray {
    rgbPalette: Uint8ClampedArray;
    alphaPalette: Uint8ClampedArray;
    data: Uint8ClampedArray;
}
export declare function RGBAtoPalettedArray(rgba: Uint8ClampedArray, extraPaletteSpaces: number): PalettedArray;
