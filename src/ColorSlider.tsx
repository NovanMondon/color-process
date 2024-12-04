/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { HorizontalFlex, VerticalFlex } from "./Styles"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"
import { colorUtil } from "./colorUtil"
import { ImageCanvas } from "./ImageCanvas"

type ColorSliderMode = "RGB" | "HSV"

export const ColorSlider = ({ state, setState }: { state: AppState, setState: SetAppState }) => {
    const [tMode, setMode] = useState<ColorSliderMode>("RGB")
    const [tInitialized, setInitialized] = useState(false)
    // const [tSliderURLs, setSliderURLs] = useState<string[]>([])
    const [tSliderPixels, setSliderPixels] = useState<PixelData[]>([])
    const [tSliderValues, setSliderValues] = useState<{ [index: number]: number }>({})
    const [tSliderMaxes, setSliderMaxes] = useState<{ [index: number]: number }>({})
    const [tSliderMins, setSliderMins] = useState<{ [index: number]: number }>({})

    // 初期化処理
    useEffect(() => {
        if (tInitialized) return
        setMode("RGB")
        setInitialized(true)
    })

    // スライダー初期化処理
    useEffect(() => {
        const tSliderPixels: PixelData[] = []

        switch (tMode) {
            case "RGB":
                const tRedSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [Math.round(x * 255), 0, 0])
                tSliderPixels.push(tRedSliderPixel)
                const tGreenSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [0, Math.round(x * 255), 0])
                tSliderPixels.push(tGreenSliderPixel)
                const tBlueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [0, 0, Math.round(x * 255)])
                tSliderPixels.push(tBlueSliderPixel)
                if (!state.isColorSanitized()) {
                    console.log("Color not sanitized")
                    setSliderValues({ 0: 0, 1: 0, 2: 0 })
                } else {
                    setSliderValues({ 0: state.color[0], 1: state.color[1], 2: state.color[2] })
                }
                setSliderMaxes({ 0: 255, 1: 255, 2: 255 })
                setSliderMins({ 0: 0, 1: 0, 2: 0 })
                break
            case "HSV":
                const tHueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([x * 360, 1, 1]))
                tSliderPixels.push(tHueSliderPixel)
                const tSaturationSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([0, x, 1]))
                tSliderPixels.push(tSaturationSliderPixel)
                const tValueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([0, 0, x]))
                tSliderPixels.push(tValueSliderPixel)
                if (state.color.length !== 3) {
                    setSliderValues({ 0: 0, 1: 0, 2: 0 })
                } else {
                    const tHSV = colorUtil.RGB2HSV(state.color)
                    setSliderValues({ 0: tHSV[0], 1: tHSV[1], 2: tHSV[2] })
                }
                setSliderMaxes({ 0: 360, 1: 1, 2: 1 })
                setSliderMins({ 0: 0, 1: 0, 2: 0 })
                break
        }
        setSliderPixels(tSliderPixels)
        console.log("Mode changed: ", tMode)
    }, [tMode])

    // スライダー値更新処理
    useEffect(() => {
        // console.log("Slider values changed: ", tSliderValues)
        let tColor = [0, 0, 0]
        switch (tMode) {
            case "RGB":
                let tRGB = [0, 0, 0]
                for (let i = 0; i < 3; i++) {
                    if (tSliderValues[i] === undefined) return
                    if (tSliderValues[i] < tSliderMins[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMins[i] }); return }
                    if (tSliderValues[i] > tSliderMaxes[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMaxes[i] }); return }
                    if (Math.round(tSliderValues[i]) !== tSliderValues[i]) { setSliderValues({ ...tSliderValues, [i]: Math.round(tSliderValues[i]) }); return }
                    tRGB[i] = tSliderValues[i]
                }
                tColor = tRGB
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

                const tSaturationSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([tHSV[0], x, 1]))
                setSliderPixels([tSliderPixels[0], tSaturationSliderPixel, tSliderPixels[2]])
                break
        }
        setState(state.update({ color: tColor }))
    }, [tSliderValues])

    const tSliderWidth = 720

    const onSlide = (e: React.MouseEvent<HTMLElement, MouseEvent>, index: number) => {
        const tElement = e.currentTarget as HTMLElement
        const tRect = tElement.getBoundingClientRect()
        const tX = e.clientX - tRect.left
        setSliderValues({
            ...tSliderValues,
            [index]: Math.round((tX / tSliderWidth * (tSliderMaxes[index] - tSliderMins[index]) + tSliderMins[index]) * 100) / 100
        })
    }

    return (
        <div css={css(VerticalFlex)}>
            <div css={css(HorizontalFlex)}>
                <button onClick={() => setMode("RGB")}>RGB</button>
                <button onClick={() => setMode("HSV")}>HSV</button>
            </div>
            <p>スライダー上をドラッグして設定</p>
            {tSliderPixels.map((pixelData, index) => (
                <div css={css(HorizontalFlex)} key={index}>
                    <div css={{ height: "1em", width: tSliderWidth, margin: 5 }}
                        onMouseDown={(e) => { onSlide(e, index) }}
                        onMouseMove={(e) => { if (e.buttons === 1) onSlide(e, index) }}
                        onDragStart={(e) => e.preventDefault()}
                    >
                        <ImageCanvas pixelData={pixelData} />
                    </div>
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
