/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { HorizontalFlex, VerticalFlex } from "./Styles"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"

type ColorSliderMode = "RGB"

export const ColorSlider = ({ state, setState }: { state: AppState, setState: SetAppState }) => {
    const [tMode, setMode] = useState<ColorSliderMode>("RGB")
    const [tInitialized, setInitialized] = useState(false)
    const [tSliderURLs, setSliderURLs] = useState<string[]>([])
    const [tSliderValues, setSliderValues] = useState<{ [index: number]: number }>({})

    // 初期化処理
    useEffect(() => {
        if (tInitialized) return

        const tSliderURLs: string[] = []

        const generateSliderPixel = (aWidth: number, aHeight: number, aColor: (x: number) => number[]): PixelData => {
            const tSliderPixel: PixelData = { width: aWidth, height: aHeight, data: [] }
            for (let y = 0; y < tSliderPixel.height; y++) {
                const tRow: number[][] = []
                for (let x = 0; x < tSliderPixel.width; x++) {
                    tRow.push(aColor(x / aWidth))
                }
                tSliderPixel.data.push(tRow)
            }
            return tSliderPixel
        }
        const tRedSliderPixel: PixelData = generateSliderPixel(300, 1, (x) => [Math.round(x * 255), 0, 0])
        tSliderURLs.push(pixelUtil.ImageData2URL(tRedSliderPixel)!)
        const tGreenSliderPixel: PixelData = generateSliderPixel(300, 1, (x) => [0, Math.round(x * 255), 0])
        tSliderURLs.push(pixelUtil.ImageData2URL(tGreenSliderPixel)!)
        const tBlueSliderPixel: PixelData = generateSliderPixel(300, 1, (x) => [0, 0, Math.round(x * 255)])
        tSliderURLs.push(pixelUtil.ImageData2URL(tBlueSliderPixel)!)

        setSliderURLs(tSliderURLs)
        setSliderValues({ 0: 0, 1: 0, 2: 0 })
        setInitialized(true)
    }, [tSliderURLs])

    // スライダー更新処理
    useEffect(() => {
        console.log(tSliderValues)
        switch (tMode) {
            case "RGB":
                let tColor = [0, 0, 0]
                for (let i = 0; i < 3; i++) {
                    if (tSliderValues[i] === undefined) return
                    tColor[i] = Math.min(Math.max(tSliderValues[i], 0), 255)
                }
                setState(state.update({ color: tColor }))
                if (tSliderValues[0] !== tColor[0] || tSliderValues[1] !== tColor[1] || tSliderValues[2] !== tColor[2]) {
                    setSliderValues({ 0: tColor[0], 1: tColor[1], 2: tColor[2] })
                }
                break
        }
    }, [tSliderValues])

    const tSliderWidth = 720

    return (
        <div css={css(VerticalFlex)}>
            <p>スライダー上をドラッグして設定</p>
            {tSliderURLs.map((url, index) => (
                <div css={css(HorizontalFlex)} key={index}>
                    <img css={{ height: "1em", width: tSliderWidth, margin: 5 }}
                        src={url}
                        alt={`slider-${index}`}
                        onMouseDown={(e) => {
                            const tImageElement = e.currentTarget as HTMLImageElement
                            const tRect = tImageElement.getBoundingClientRect()
                            const tX = e.clientX - tRect.left
                            setSliderValues({ ...tSliderValues, [index]: Math.round(tX / tSliderWidth * 256) })
                        }}
                        onMouseMove={(e) => {
                            if (e.buttons !== 1) return
                            const tImageElement = e.currentTarget as HTMLImageElement
                            const tRect = tImageElement.getBoundingClientRect()
                            const tX = e.clientX - tRect.left
                            setSliderValues({ ...tSliderValues, [index]: Math.round(tX / tSliderWidth * 256) })
                        }}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    <input css={{ width: "3em", margin: 5 }}
                        value={tSliderValues[index] ?? 0}
                        onChange={(e) => {
                            const tValue = parseInt(e.target.value)
                            if (isNaN(tValue)) return
                            setSliderValues({ ...tSliderValues, [index]: tValue })
                        }}
                    />
                </div>
            ))}
        </div>
    )
}
