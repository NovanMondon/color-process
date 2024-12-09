/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { HorizontalFlex, VerticalFlex } from "./Styles"
import { ColorIndicator } from "./ColorIndicator"
import { useEffect, useState } from "react"
import { pixelUtil, PixelData } from "./pixelUtil"
import { ImageCanvas } from "./ImageCanvas"
import { ImageProcess } from "./imageProcess"


export function ColorPicker({ state, setState }: { state: AppState, setState: SetAppState }) {
    const [tImageFile, setImageFile] = useState<File | null>(null)
    const [tImageData, setImageData] = useState<PixelData | null>(null)
    const [tZoom, setZoom] = useState(1)
    const [tMagnifiedImageData, setMagnifiedImageData] = useState<PixelData | null>(null)
    const [tPointedColor, setPointedColor] = useState([0, 0, 0])

    // file => image
    useEffect(() => {
        if (!tImageFile) return
        const tImage = new Image()
        tImage.src = URL.createObjectURL(tImageFile)
        tImage.onload = () => {
            setZoom(1)
            setState(state.update({ image: tImage }))
        }
    }, [tImageFile])

    // image => imageData
    useEffect(() => {
        if (!state.image) return
        const tImageFileData = pixelUtil.Element2ImageData(state.image)
        if (!tImageFileData) return
        const tImageData = ImageProcess.zoomImageData(tImageFileData, tZoom)
        setImageData(tImageData)
    }, [state.image, tZoom])

    // カラーピッカー
    const pickColor = (_: React.MouseEvent<HTMLDivElement>) => {
        if (!tPointedColor) return
        setState(state.update({ color: tPointedColor }))
    }

    const pointColor = (aEvent: React.MouseEvent<HTMLDivElement>) => {
        if (!state.image) return
        if (!tImageData) return

        const tImageElement = aEvent.currentTarget as HTMLImageElement
        const tRect = tImageElement.getBoundingClientRect()
        const tX = Math.round(aEvent.clientX - tRect.left)
        const tY = Math.round(aEvent.clientY - tRect.top)

        if (tX < 0 || tY < 0 || tX >= tImageData.width || tY >= tImageData.height) return

        setPointedColor(tImageData.data[tY][tX])

        const tMagnifiedRegionWidth = 11
        const tMagnifiedRegionHeight = 11
        const tMagnifiedRegionData: PixelData = {
            width: tMagnifiedRegionWidth,
            height: tMagnifiedRegionHeight,
            data: [],
        }
        for (let y = 0; y < tMagnifiedRegionHeight; y++) {
            const tRow = []
            for (let x = 0; x < tMagnifiedRegionWidth; x++) {
                const tXOffset = x - Math.floor(tMagnifiedRegionWidth / 2)
                const tYOffset = y - Math.floor(tMagnifiedRegionHeight / 2)
                const tSourceX = tX + tXOffset
                const tSourceY = tY + tYOffset
                if (tSourceX < 0 || tSourceY < 0 || tSourceX >= tImageData.width || tSourceY >= tImageData.height) {
                    tRow.push([0, 0, 0])
                    continue
                }
                tRow.push(tImageData.data[tSourceY][tSourceX])
            }
            tMagnifiedRegionData.data.push(tRow)
        }

        const tMagnifiedImageData = ImageProcess.zoomImageData(tMagnifiedRegionData, 10)
        setMagnifiedImageData(tMagnifiedImageData)
    }

    return (
        <>
            <div css={css(HorizontalFlex)}
                onKeyDown={(e) => { if (e.key === '+') setZoom(tZoom + 0.1); if (e.key === '-') setZoom(tZoom - 0.1) }}
                tabIndex={0}
            >
                <div css={{ height: 750, width: 750 }}>
                    <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    <div css={css({ border: '1px solid black', overflow: 'scroll', height: 720, width: 720 })}
                        onDrop={(e) => { e.preventDefault(); setImageFile(e.dataTransfer.files?.[0] || null) }}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {tImageData &&
                            <div css={{ width: tImageData.width, height: tImageData.height, pointerEvents: 'auto', cursor: 'pointer' }}
                                onClick={pickColor}
                                onMouseMove={pointColor}
                            >
                                <ImageCanvas pixelData={tImageData} />
                            </div>
                        }
                    </div>
                </div>
                <div css={css(VerticalFlex, { padding: 10 })}>
                    <h3>Pointed Color</h3>
                    <ColorIndicator color={tPointedColor} />
                    {tMagnifiedImageData &&
                        <div css={{ width: 100, height: 100 }}>
                            <ImageCanvas pixelData={tMagnifiedImageData} />
                        </div>
                    }
                    <div>
                        <p>+キーで拡大、-キーで縮小</p>
                    </div>
                </div>
            </div>
        </>
    )
}
