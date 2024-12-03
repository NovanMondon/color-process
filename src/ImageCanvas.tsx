/** @jsxImportSource @emotion/react */

import { PixelData, pixelUtil } from "./pixelUtil"
import { useEffect, useRef } from "react"

export const ImageCanvas = ({ pixelData }: { pixelData: PixelData | null }) => {
    const tCanvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (!pixelData) return
        if (!tCanvasRef.current) return
        const tCanvas = tCanvasRef.current

        pixelUtil.DrawImageData(pixelData, tCanvas)
    }, [pixelData])

    return <canvas ref={tCanvasRef}
        css={{height: '100%', width: '100%'}}
    >
    </canvas>
}
