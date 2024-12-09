import { PixelData } from "./pixelUtil"

export const ImageProcess ={
    zoomImageData: (aImageData: PixelData, aZoom: number): PixelData => {
        const tImageData: PixelData = {
            width: Math.floor(aImageData.width * aZoom),
            height: Math.floor(aImageData.height * aZoom),
            data: [],
        }
        for (let y = 0; y < tImageData.height; y++) {
            const tRow = []
            for (let x = 0; x < tImageData.width; x++) {
                const tSourceX = Math.floor(x / aZoom)
                const tSourceY = Math.floor(y / aZoom)

                if (tSourceX >= aImageData.width || tSourceY >= aImageData.height || tSourceX < 0 || tSourceY < 0) {
                    tRow.push([0, 0, 0])
                    continue
                }
                const tPixel = aImageData.data[tSourceY][tSourceX]
                tRow.push(tPixel)
            }
            tImageData.data.push(tRow)
        }
        return tImageData
    }
}
