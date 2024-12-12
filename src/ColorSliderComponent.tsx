/** @jsxImportSource @emotion/react */

import { AppState, SetAppState } from "./appState"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"
import { Slider1D } from "./Slider1D"
import { ImageCanvas } from "./ImageCanvas"
import { Slider2D } from "./Slider2D"
import { HorizontalFlex } from "./Styles"
import { css } from "@emotion/react"

type ColorSliderComponentProps = {
    state: AppState,
    setState: SetAppState,
    flagRealtime: boolean,
    valueMax: number[],
    valueMin: number[],
    valueStep: number[],
    valueInit: { [index: number]: number }
    value2Color: (value: { [index: number]: number }) => number[]
    color2Value: (color: number[]) => { [index: number]: number }
    normalizeValue: (value: { [index: number]: number }) => [boolean, { [index: number]: number }]
}

export const ColorSliderComponent = (
    { state, setState, flagRealtime, valueInit, valueMax, valueMin, valueStep, value2Color, color2Value, normalizeValue }: ColorSliderComponentProps
) => {
    const [tValue, setValue] = useState<{ [index: number]: number }>(valueInit)

    const [t2DTarget, set2DTarget] = useState<[number, number]>([-1, -1])
    const [tValue2D, setValue2D] = useState<[number, number]>([0, 0])

    const [tSliderPixels, setSliderPixels] = useState<PixelData[]>([])
    const [t2DSliderPixels, set2DSliderPixels] = useState<PixelData[]>([])

    // 初期化処理
    useEffect(() => {
        if (!state.isColorSanitized()) {
            console.log("Color not sanitized")
        } else {
            setValue(color2Value(state.color))
        }
    }, [])

    // スライダー更新処理
    useEffect(() => {
        // 値のチェック
        const [flag, tNewValue] = normalizeValue([tValue[0], tValue[1], tValue[2]])
        if (flag) {
            setValue({ 0: tNewValue[0], 1: tNewValue[1], 2: tNewValue[2] })
            return
        }

        // 色の更新
        setState(state.update({ color: value2Color(tValue) }))
    }, [tValue])

    // 2Dスライダー更新処理
    useEffect(() => {
        // 値のチェック
        const tUpdatedValue = { ...tValue, [t2DTarget[0]]: tValue2D[0], [t2DTarget[1]]: tValue2D[1] }
        const [flag, tNewValue] = normalizeValue([tUpdatedValue[0], tUpdatedValue[1], tUpdatedValue[2]])
        if (flag) {
            setValue2D([tNewValue[t2DTarget[0]], tNewValue[t2DTarget[1]]])
            return
        }

        // 値の更新
        setValue(tUpdatedValue)
    }, [tValue2D])

    // 2Dスライダーのターゲットが変更された場合の処理
    useEffect(() => {
        if (t2DTarget[0] < 0 || t2DTarget[1] < 0) {
            return
        }
        setValue2D([tValue[t2DTarget[0]], tValue[t2DTarget[1]]])
    }, [t2DTarget])

    // スライダー画像の更新
    useEffect(() => {
        // 1Dスライダー
        if (flagRealtime) {
            let tPixels = []
            for (let i = 0; i < 3; i++) {
                tPixels.push(pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => {
                    const tTempValue = { ...tValue, [i]: x * valueMax[i] }
                    return value2Color(tTempValue)
                })
                )
            }
            setSliderPixels(tPixels)
        } else {
            let tPixels = []
            for (let i = 0; i < 3; i++) {
                tPixels.push(pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => {
                    const tTempValue = { ...valueInit, [i]: x * valueMax[i] }
                    return value2Color(tTempValue)
                })
                )
            }
            setSliderPixels(tPixels)
        }

        // 2Dスライダー
        if (flagRealtime) {
            const t2DSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 300, (x, y) => {
                const tTempValue = { ...tValue, [t2DTarget[0]]: x * valueMax[t2DTarget[0]], [t2DTarget[1]]: y * valueMax[t2DTarget[1]] }
                return value2Color(tTempValue)
            })
            set2DSliderPixels([t2DSliderPixel])
        } else {
            const t2DSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 300, (x, y) => {
                const tTempValue = { ...valueInit, [t2DTarget[0]]: x * valueMax[t2DTarget[0]], [t2DTarget[1]]: y * valueMax[t2DTarget[1]] }
                return value2Color(tTempValue)
            })
            set2DSliderPixels([t2DSliderPixel])
        }
    }, [tValue, flagRealtime, t2DTarget])

    const is2DSliderEnabled = () => { return t2DTarget[0] >= 0 && t2DTarget[1] >= 0 && t2DTarget[0] !== t2DTarget[1] }

    return (
        <>
            {Object.keys(tValue).map((k) => { console.log(k); return Number(k) }).filter((i) => i >= 0).map((i) =>
                !(is2DSliderEnabled() && (i === t2DTarget[0] || i === t2DTarget[1])) && (
                    <div key={i} css={css(HorizontalFlex)} >
                        <Slider1D
                            value={tValue[i] ?? valueMin[i]}
                            min={valueMin[i]}
                            max={valueMax[i]}
                            step={valueStep[i]}
                            setValue={(v) => setValue({ ...tValue, [i]: v })}>
                            <ImageCanvas pixelData={tSliderPixels[i]} />
                        </Slider1D>
                        <label>
                            <input type="radio" name="2DTarget0" value={i} onChange={() => set2DTarget([i, t2DTarget[1]])} />
                            2D x
                        </label>
                        <label>
                            <input type="radio" name="2DTarget1" value={i} onChange={() => set2DTarget([t2DTarget[0], i])} />
                            2D y
                        </label>
                    </div >
                )
            )}
            {
                is2DSliderEnabled() && (
                    <Slider2D
                        value={tValue2D}
                        min={[valueMin[t2DTarget[0]], valueMin[t2DTarget[1]]]}
                        max={[valueMax[t2DTarget[0]], valueMax[t2DTarget[1]]]}
                        step={[valueStep[t2DTarget[0]], valueStep[t2DTarget[1]]]}
                        setValue={(v) => setValue2D(v)}>
                        <ImageCanvas pixelData={t2DSliderPixels[0]} />
                    </Slider2D>
                )
            }
        </>
    )
}
