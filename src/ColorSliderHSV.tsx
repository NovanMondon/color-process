/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"
import { HorizontalFlex, InheritedSize, SliderHandleRadius, SliderHeight, SliderWidth, SlideThumbStyle } from "./Styles"
import { ImageCanvas } from "./ImageCanvas"
import { colorUtil } from "./colorUtil"
import { MathUtil } from "./mathUtil"
import { Slider1D } from "./Slider1D"


export const ColorSliderHSV = ({ state, setState, flagRealtime }: { state: AppState, setState: SetAppState, flagRealtime: boolean }) => {
    const [tSliderPixels, setSliderPixels] = useState<PixelData[]>([])
    const [tHSV, setHSV] = useState<{ [index: number]: number }>({ 0: 0, 1: 0, 2: 0 })

    // 初期化処理
    useEffect(() => {
        if (!state.isColorSanitized()) {
            console.log("Color not sanitized")
        } else {
            const tHSV = colorUtil.RGB2HSV(state.color)
            setHSV({ 0: tHSV[0], 1: tHSV[1], 2: tHSV[2] })
        }
    }, [])

    // スライダー更新処理
    useEffect(() => {
        // console.log("HSV: ", [tHSV[0], tHSV[1], tHSV[2]])
        // 値のチェック
        for (let i = 0; i < 3; i++) {
            if (i === 0) { // Hue
                if (tHSV[i] < 0) {
                    setHSV({ ...tHSV, [i]: 0 })
                    return
                }
                if (tHSV[i] > 360) {
                    setHSV({ ...tHSV, [i]: 360 })
                    return
                }
                if (Math.round(tHSV[i]) !== tHSV[i]) {
                    setHSV({ ...tHSV, [i]: Math.round(tHSV[i]) })
                    return
                }
            } else { // Saturation, Value
                if (tHSV[i] < 0) {
                    setHSV({ ...tHSV, [i]: 0 })
                    return
                }
                if (tHSV[i] > 1) {
                    setHSV({ ...tHSV, [i]: 1 })
                    return
                }
            }
        }

        // スライダー画像の更新
        if (flagRealtime) {
            const tHueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([x * 360, tHSV[1], tHSV[2]]))
            const tSaturationSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([tHSV[0], x, tHSV[2]]))
            const tValueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([tHSV[0], tHSV[1], x]))
            setSliderPixels([tHueSliderPixel, tSaturationSliderPixel, tValueSliderPixel])
        } else {
            const tHueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([x * 360, 1, 1]))
            const tSaturationSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([0, x, 1]))
            const tValueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([0, 0, x]))
            setSliderPixels([tHueSliderPixel, tSaturationSliderPixel, tValueSliderPixel])
        }

        // 色の更新
        const tColor = colorUtil.HSV2RGB([tHSV[0], tHSV[1], tHSV[2]])
        setState(state.update({ color: tColor }))
    }, [tHSV, flagRealtime])

    return (
        <>
            <Slider1D value={tHSV[0] ?? 0} min={0} max={360} step={1} setValue={(v) => setHSV({ ...tHSV, 0: v })}>
                <ImageCanvas pixelData={tSliderPixels[0]} />
            </Slider1D>
            <Slider1D value={tHSV[1] ?? 0} min={0} max={1} step={0.01} setValue={(v) => setHSV({ ...tHSV, 1: v })}>
                <ImageCanvas pixelData={tSliderPixels[1]} />
            </Slider1D>
            <Slider1D value={tHSV[2] ?? 0} min={0} max={1} step={0.01} setValue={(v) => setHSV({ ...tHSV, 2: v })}>
                <ImageCanvas pixelData={tSliderPixels[2]} />
            </Slider1D>
        </>
    )
}
