/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"
import { HorizontalFlex, InheritedSize, SliderHandleRadius, SliderHeight, SliderWidth, SlideThumbStyle } from "./Styles"
import { ImageCanvas } from "./ImageCanvas"
import { colorUtil } from "./colorUtil"
import { MathUtil } from "./mathUtil"


export const ColorSliderHSV = ({ state, setState, flagRealtime }: { state: AppState, setState: SetAppState, flagRealtime: boolean }) => {
    const [tSliderPixels, setSliderPixels] = useState<PixelData[]>([])
    const [tSliderValues, setSliderValues] = useState<{ [index: number]: number }>({ 0: 0, 1: 0, 2: 0 })
    const [tSliderThumbPositions, setSliderThumbPositions] = useState<{ [index: number]: number }>({})

    // 初期化処理
    useEffect(() => {
        if (!state.isColorSanitized()) {
            console.log("Color not sanitized")
        } else {
            const tHSV = colorUtil.RGB2HSV(state.color)
            setSliderValues({ 0: tHSV[0], 1: tHSV[1], 2: tHSV[2] })
        }
    }, [])

    // スライダー更新処理
    useEffect(() => {
        // 値のチェック
        let tHSV = [0, 0, 0]
        for (let i = 0; i < 3; i++) {
            if (i === 0) { // Hue
                if (tSliderValues[i] < 0) {
                    setSliderValues({ ...tSliderValues, [i]: 0 })
                    return
                }
                if (tSliderValues[i] > 360) {
                    setSliderValues({ ...tSliderValues, [i]: 360 })
                    return
                }
                if (Math.round(tSliderValues[i]) !== tSliderValues[i]) {
                    setSliderValues({ ...tSliderValues, [i]: Math.round(tSliderValues[i]) })
                    return
                }
            } else { // Saturation, Value
                if (tSliderValues[i] < 0) {
                    setSliderValues({ ...tSliderValues, [i]: 0 })
                    return
                }
                if (tSliderValues[i] > 1) {
                    setSliderValues({ ...tSliderValues, [i]: 1 })
                    return
                }
            }
            tHSV[i] = tSliderValues[i]
        }

        // スライダー画像の更新
        if (flagRealtime) {
            const tHueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([x * 360, tHSV[1], tHSV[2]]))
            const tSaturationSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([tHSV[0], x,  tHSV[2]]))
            const tValueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([tHSV[0], tHSV[1], x]))
            setSliderPixels([tHueSliderPixel, tSaturationSliderPixel, tValueSliderPixel])
        } else {
            const tHueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([x * 360, 1, 1]))
            const tSaturationSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([0, x, 1]))
            const tValueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([0, 0, x]))
            setSliderPixels([tHueSliderPixel, tSaturationSliderPixel, tValueSliderPixel])
        }

        // 色の更新
        const tColor = colorUtil.HSV2RGB(tHSV)
        setState(state.update({ color: tColor }))
    }, [tSliderValues, flagRealtime])

    // スライダーハンドル移動処理
    useEffect(() => {
        const tThumbPositions: { [index: number]: number } = {}
        for (let tKey in tSliderValues) {
            if (tSliderValues[tKey] === undefined) continue
            if (tKey === "0") tThumbPositions[tKey] = tSliderValues[tKey] / 360 * SliderWidth - SliderHandleRadius
            else tThumbPositions[tKey] = tSliderValues[tKey] * SliderWidth - SliderHandleRadius
        }
        setSliderThumbPositions(tThumbPositions)
    }, [tSliderValues])

    const onSlide = (e: React.MouseEvent<HTMLElement, MouseEvent>, index: number) => {
        const tElement = e.currentTarget as HTMLElement
        const tRect = tElement.getBoundingClientRect()
        const tX = e.clientX - tRect.left
        setSliderValues({
            ...tSliderValues,
            [index]: index === 0 ? Math.round(tX / SliderWidth * 360) : MathUtil.roundTo(tX / SliderWidth, 2)
        })
    }

    return (
        <>
            {tSliderPixels.map((tPixelData, tIndex) => (
                <div css={css(HorizontalFlex)} key={tIndex}>
                    <div css={{ height: SliderHeight, width: SliderWidth, margin: 5, position: "relative" }}
                        onMouseDown={(e) => { onSlide(e, tIndex) }}
                        onMouseMove={(e) => { if (e.buttons === 1) onSlide(e, tIndex) }}
                        onDragStart={(e) => e.preventDefault()}
                    >
                        <div css={css(InheritedSize, { position: "absolute" })}>
                            <ImageCanvas pixelData={tPixelData} />
                        </div>
                        <div css={css(SlideThumbStyle, { left: tSliderThumbPositions[tIndex] ?? 0 })} />
                    </div>
                    <input css={{ width: "3em", margin: 5 }}
                        value={tSliderValues[tIndex] ?? 0}
                        onChange={(e) => {
                            const tValue = parseInt(e.target.value)
                            if (isNaN(tValue)) return
                            setSliderValues({ ...tSliderValues, [tIndex]: tValue })
                        }}
                    />
                </div>
            ))}
        </>
    )
}
