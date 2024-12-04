export type PixelData = {
    width: number
    height: number
    data: number[][][]
}

export const pixelUtil = {
    Element2ImageData: (aImageElement: HTMLImageElement): PixelData | null => {
        const tCanvas = document.createElement('canvas')
        tCanvas.width = aImageElement.width
        tCanvas.height = aImageElement.height
        const tContext = tCanvas.getContext('2d')
        if (!tContext) return null
        tContext.drawImage(aImageElement, 0, 0)
        const tImageData = tContext.getImageData(0, 0, aImageElement.width, aImageElement.height)
        const tData = tImageData.data

        const tResult: number[][][] = []
        for (let y = 0; y < aImageElement.height; y++) {
            const tRow: number[][] = []
            for (let x = 0; x < aImageElement.width; x++) {
                const tIndex = (y * aImageElement.width + x) * 4
                tRow.push([tData[tIndex], tData[tIndex + 1], tData[tIndex + 2]])
            }
            tResult.push(tRow)
        }

        return {
            width: aImageElement.width,
            height: aImageElement.height,
            data: tResult
        }
    },

    ImageData2URL: (aImageData: PixelData): string | null => {
        const tCanvas = document.createElement('canvas')
        tCanvas.width = aImageData.width
        tCanvas.height = aImageData.height
        const tContext = tCanvas.getContext('2d')
        if (!tContext) return null
        const tData = new Uint8ClampedArray(aImageData.width * aImageData.height * 4)
        for (let y = 0; y < aImageData.height; y++) {
            for (let x = 0; x < aImageData.width; x++) {
                const tIndex = (y * aImageData.width + x) * 4
                tData[tIndex] = aImageData.data[y][x][0]
                tData[tIndex + 1] = aImageData.data[y][x][1]
                tData[tIndex + 2] = aImageData.data[y][x][2]
                tData[tIndex + 3] = 255
            }
        }
        const tImageData = new ImageData(tData, aImageData.width, aImageData.height)
        tContext.putImageData(tImageData, 0, 0)
        return tCanvas.toDataURL()
    },

    DrawImageData: (aImageData: PixelData, aCanvas: HTMLCanvasElement): void => {
        aCanvas.width = aImageData.width
        aCanvas.height = aImageData.height
        const tContext = aCanvas.getContext('2d')
        if (!tContext) return
        const tData = new Uint8ClampedArray(aImageData.width * aImageData.height * 4)
        for (let y = 0; y < aImageData.height; y++) {
            for (let x = 0; x < aImageData.width; x++) {
                const tIndex = (y * aImageData.width + x) * 4
                tData[tIndex] = aImageData.data[y][x][0]
                tData[tIndex + 1] = aImageData.data[y][x][1]
                tData[tIndex + 2] = aImageData.data[y][x][2]
                tData[tIndex + 3] = 255
            }
        }
        const tImageData = new ImageData(tData, aImageData.width, aImageData.height)
        tContext.putImageData(tImageData, 0, 0)
    },

    GeneratePixelFromFunc: (aWidth: number, aHeight: number, aColor: (x: number, y: number) => number[]): PixelData => {
        const tSliderPixel: PixelData = { width: aWidth, height: aHeight, data: [] }
        for (let y = 0; y < tSliderPixel.height; y++) {
            const tRow: number[][] = []
            for (let x = 0; x < tSliderPixel.width; x++) {
                const tX = x / (tSliderPixel.width - 1)
                const tY = y / (tSliderPixel.height - 1)
                tRow.push(aColor(tX, tY))
            }
            tSliderPixel.data.push(tRow)
        }
        return tSliderPixel
    },
}
