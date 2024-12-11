/** @jsxImportSource @emotion/react */

import { AppState, SetAppState } from "./appState"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"
import { Slider1D } from "./Slider1D"
import { ImageCanvas } from "./ImageCanvas"
import { Slider2D } from "./Slider2D"
import { HorizontalFlex } from "./Styles"
import { css } from "@emotion/react"

const RGB_MAX = [255, 255, 255]
const RGB_MIN = [0, 0, 0]
const RGB_STEP = [1, 1, 1]
const RGB_INIT = { 0: 0, 1: 0, 2: 0 }

export const ColorSliderRGB = ({ state, setState, flagRealtime }: { state: AppState, setState: SetAppState, flagRealtime: boolean }) => {
    const [tRGB, setRGB] = useState<{ [index: number]: number }>(RGB_INIT)

    const [t2DTarget, set2DTarget] = useState<[number, number]>([-1, -1])
    const [tValue2D, setValue2D] = useState<[number, number]>([0, 0])

    const [tSliderPixels, setSliderPixels] = useState<PixelData[]>([])
    const [t2DSliderPixels, set2DSliderPixels] = useState<PixelData[]>([])

    // 初期化処理
    useEffect(() => {
        console.log("ColorSliderRGB")
        if (!state.isColorSanitized()) {
            console.log("Color not sanitized")
        } else {
            setRGB({ 0: state.color[0], 1: state.color[1], 2: state.color[2] })
        }
    }, [])

    // スライダー更新処理
    useEffect(() => {
        // console.log("RGB: ", tRGB)
        // 値のチェック
        const [flag, tNewRGB] = normalizeRGB([tRGB[0], tRGB[1], tRGB[2]])
        if (flag) {
            setRGB({ 0: tNewRGB[0], 1: tNewRGB[1], 2: tNewRGB[2] })
            return
        }

        // 色の更新
        setState(state.update({ color: [tRGB[0], tRGB[1], tRGB[2]] }))
    }, [tRGB])

    // 2Dスライダー更新処理
    useEffect(() => {
        // 値のチェック
        const tRGB_ = { ...tRGB, [t2DTarget[0]]: tValue2D[0], [t2DTarget[1]]: tValue2D[1] }
        const [flag, tNewRGB] = normalizeRGB([tRGB_[0], tRGB_[1], tRGB_[2]])
        if (flag) {
            setValue2D([tNewRGB[t2DTarget[0]], tNewRGB[t2DTarget[1]]])
            return
        }

        // 値の更新
        setRGB(tRGB_)
    }, [tValue2D])

    // 2Dスライダーのターゲットが変更された場合の処理
    useEffect(() => {
        if (t2DTarget[0] < 0 || t2DTarget[1] < 0) {
            return
        }
        setValue2D([tRGB[t2DTarget[0]], tRGB[t2DTarget[1]]])
    }, [t2DTarget])

    // スライダー画像の更新
    useEffect(() => {
        // 1Dスライダー
        if (flagRealtime) {
            let tPixels = []
            for (let i = 0; i < 3; i++) {
                tPixels.push(pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => {
                    const tRGB_ = { ...tRGB, [i]: x * RGB_MAX[i] }
                    return [tRGB_[0], tRGB_[1], tRGB_[2]]
                })
                )
            }
            setSliderPixels(tPixels)
        } else {
            let tPixels = []
            for (let i = 0; i < 3; i++) {
                tPixels.push(pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => {
                    const tRGB_ = { ...RGB_INIT, [i]: x * RGB_MAX[i] }
                    return [tRGB_[0], tRGB_[1], tRGB_[2]]
                })
                )
            }
            setSliderPixels(tPixels)
        }

        // 2Dスライダー
        if (flagRealtime) {
            const t2DSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 300, (x, y) => {
                const tRGB_ = { ...tRGB, [t2DTarget[0]]: x * RGB_MAX[t2DTarget[0]], [t2DTarget[1]]: y * RGB_MAX[t2DTarget[1]] }
                return [tRGB_[0], tRGB_[1], tRGB_[2]]
            })
            set2DSliderPixels([t2DSliderPixel])
        } else {
            const t2DSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 300, (x, y) => {
                const tRGB_ = { ...RGB_INIT, [t2DTarget[0]]: x * RGB_MAX[t2DTarget[0]], [t2DTarget[1]]: y * RGB_MAX[t2DTarget[1]] }
                return [tRGB_[0], tRGB_[1], tRGB_[2]]
            })
            set2DSliderPixels([t2DSliderPixel])
        }
    }, [tRGB, flagRealtime, t2DTarget])

    return (
        <>
            <div css={css(HorizontalFlex)} >
                <Slider1D value={tRGB[0] ?? 0} min={0} max={255} step={1} setValue={(v) => setRGB({ ...tRGB, 0: v })}>
                    <ImageCanvas pixelData={tSliderPixels[0]} />
                </Slider1D>
                <label>
                    <input type="radio" name="2DTarget0" value="0" onChange={() => set2DTarget([0, t2DTarget[1]])} />
                    2D x
                </label>
                <label>
                    <input type="radio" name="2DTarget1" value="0" onChange={() => set2DTarget([t2DTarget[0], 0])} />
                    2D y
                </label>
            </div>
            <div css={css(HorizontalFlex)} >
                <Slider1D value={tRGB[1] ?? 0} min={0} max={255} step={1} setValue={(v) => setRGB({ ...tRGB, 1: v })}>
                    <ImageCanvas pixelData={tSliderPixels[1]} />
                </Slider1D>
                <label>
                    <input type="radio" name="2DTarget0" value="1" onChange={() => set2DTarget([1, t2DTarget[1]])} />
                    2D x
                </label>
                <label>
                    <input type="radio" name="2DTarget1" value="1" onChange={() => set2DTarget([t2DTarget[0], 1])} />
                    2D y
                </label>
            </div>
            <div css={css(HorizontalFlex)} >
                <Slider1D value={tRGB[2] ?? 0} min={0} max={255} step={1} setValue={(v) => setRGB({ ...tRGB, 2: v })}>
                    <ImageCanvas pixelData={tSliderPixels[2]} />
                </Slider1D>
                <label>
                    <input type="radio" name="2DTarget0" value="2" onChange={() => set2DTarget([2, t2DTarget[1]])} />
                    2D x
                </label>
                <label>
                    <input type="radio" name="2DTarget1" value="2" onChange={() => set2DTarget([t2DTarget[0], 2])} />
                    2D y
                </label>
            </div>
            {t2DTarget[0] >= 0 && t2DTarget[1] >= 0 && t2DTarget[0] !== t2DTarget[1] && (
                <Slider2D
                    value={tValue2D}
                    min={[RGB_MIN[t2DTarget[0]], RGB_MIN[t2DTarget[1]]]}
                    max={[RGB_MAX[t2DTarget[0]], RGB_MAX[t2DTarget[1]]]}
                    step={[RGB_STEP[t2DTarget[0]], RGB_STEP[t2DTarget[1]]]}
                    setValue={(v) => setValue2D(v)}>
                    <ImageCanvas pixelData={t2DSliderPixels[0]} />
                </Slider2D>
            )}
        </>
    )
}

function normalizeRGB(rgb: number[]): [boolean, number[]] {
    if (rgb.length !== 3) {
        return [true, [0, 0, 0]]
    }
    let tFlag = false
    let tRGB = [...rgb]
    for (let i = 0; i < 3; i++) {
        if (rgb[i] < 0) {
            tRGB[i] = 0
            tFlag = true
        } else if (rgb[i] > 255) {
            tRGB[i] = 255
            tFlag = true
        } else if (Math.floor(rgb[i]) !== rgb[i]) {
            tRGB[i] = Math.round(rgb[i])
            tFlag = true
        }
    }
    return [tFlag, tRGB]
}
