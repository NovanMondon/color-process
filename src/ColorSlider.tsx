/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { HorizontalFlex, VerticalFlex } from "./Styles"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"
import { colorUtil } from "./colorUtil"
import { log } from "console"

type ColorSliderMode = "RGB" | "HSV"

export const ColorSlider = ({ state, setState }: { state: AppState, setState: SetAppState }) => {
    const [tMode, setMode] = useState<ColorSliderMode>("RGB")
    const [tInitialized, setInitialized] = useState(false)
    const [tSliderURLs, setSliderURLs] = useState<string[]>([])
    const [tSliderValues, setSliderValues] = useState<{ [index: number]: number }>({})
    const [tSliderMaxes, setSliderMaxes] = useState<{ [index: number]: number }>({})
    const [tSliderMins, setSliderMins] = useState<{ [index: number]: number }>({})

    // 初期化処理
    useEffect(() => {
        if (tInitialized) return
        setMode("HSV")
        setInitialized(true)
    }, [tSliderURLs])

    // スライダー初期化処理
    useEffect(() => {
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

        switch (tMode) {
            case "RGB":
                const tRedSliderPixel: PixelData = generateSliderPixel(300, 1, (x) => [Math.round(x * 255), 0, 0])
                tSliderURLs.push(pixelUtil.ImageData2URL(tRedSliderPixel)!)
                const tGreenSliderPixel: PixelData = generateSliderPixel(300, 1, (x) => [0, Math.round(x * 255), 0])
                tSliderURLs.push(pixelUtil.ImageData2URL(tGreenSliderPixel)!)
                const tBlueSliderPixel: PixelData = generateSliderPixel(300, 1, (x) => [0, 0, Math.round(x * 255)])
                tSliderURLs.push(pixelUtil.ImageData2URL(tBlueSliderPixel)!)

                setSliderValues({ 0: state.color[0], 1: state.color[1], 2: state.color[2] })
                setSliderMaxes({ 0: 255, 1: 255, 2: 255 })
                setSliderMins({ 0: 0, 1: 0, 2: 0 })
                break
            case "HSV":
                const tHueSliderPixel: PixelData = generateSliderPixel(300, 1, (x) => colorUtil.HSV2RGB([x * 360, 1, 1]))
                tSliderURLs.push(pixelUtil.ImageData2URL(tHueSliderPixel)!)
                const tSaturationSliderPixel: PixelData = generateSliderPixel(300, 1, (x) => colorUtil.HSV2RGB([0, x, 1]))
                tSliderURLs.push(pixelUtil.ImageData2URL(tSaturationSliderPixel)!)
                const tValueSliderPixel: PixelData = generateSliderPixel(300, 1, (x) => colorUtil.HSV2RGB([0, 0, x]))
                tSliderURLs.push(pixelUtil.ImageData2URL(tValueSliderPixel)!)

                const tHSV = colorUtil.RGB2HSV(state.color)
                setSliderValues({ 0: tHSV[0], 1: tHSV[1], 2: tHSV[2] })
                setSliderMaxes({ 0: 360, 1: 1, 2: 1 })
                setSliderMins({ 0: 0, 1: 0, 2: 0 })
                break
        }
        setSliderURLs(tSliderURLs)
    }, [tMode])

    // スライダー値更新処理
    useEffect(() => {
        console.log(tSliderValues)
        let tColor = [0, 0, 0]
        switch (tMode) {
            case "RGB":
                for (let i = 0; i < 3; i++) {
                    if (tSliderValues[i] === undefined) return
                    if (tSliderValues[i] < tSliderMins[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMins[i] }); return }
                    if (tSliderValues[i] > tSliderMaxes[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMaxes[i] }); return }
                    tColor[i] = tSliderValues[i]
                }
                setState(state.update({ color: tColor }))
                break
            case "HSV":
                let tHSV = [0, 0, 0]
                for (let i = 0; i < 3; i++) {
                    if (tSliderValues[i] === undefined) return
                    if (tSliderValues[i] < tSliderMins[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMins[i] }); return }
                    if (tSliderValues[i] > tSliderMaxes[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMaxes[i] }); return }
                    tHSV[i] = tSliderValues[i]
                }
                tColor = colorUtil.HSV2RGB(tHSV)
                setState(state.update({ color: tColor }))
                break
        }

    }, [tSliderValues])

    const tSliderWidth = 720

    const onSlide = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, index: number) => {
        const tImageElement = e.currentTarget as HTMLImageElement
        const tRect = tImageElement.getBoundingClientRect()
        const tX = e.clientX - tRect.left
        setSliderValues({
            ...tSliderValues,
            [index]: Math.round((tX / tSliderWidth * (tSliderMaxes[index] - tSliderMins[index]) + tSliderMins[index]) * 100) / 100
        })
    }

    return (
        <div css={css(VerticalFlex)}>
            <p>スライダー上をドラッグして設定</p>
            {tSliderURLs.map((url, index) => (
                <div css={css(HorizontalFlex)} key={index}>
                    <img css={{ height: "1em", width: tSliderWidth, margin: 5 }}
                        src={url}
                        alt={`slider-${index}`}
                        onMouseDown={(e) => { onSlide(e, index) }}
                        onMouseMove={(e) => { if (e.buttons === 1) onSlide(e, index) }}
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
