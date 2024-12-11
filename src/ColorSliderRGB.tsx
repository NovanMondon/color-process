/** @jsxImportSource @emotion/react */

import { AppState, SetAppState } from "./appState"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"
import { Slider1D } from "./Slider1D"
import { ImageCanvas } from "./ImageCanvas"
import { Slider2D } from "./Slider2D"

export const ColorSliderRGB = ({ state, setState, flagRealtime }: { state: AppState, setState: SetAppState, flagRealtime: boolean }) => {
    const [tSliderPixels, setSliderPixels] = useState<PixelData[]>([])
    const [tRGB, setRGB] = useState<{ [index: number]: number }>({ 0: 0, 1: 0, 2: 0 })
    const [tTest2D, setTest2D] = useState<[number, number]>([0, 0])
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
    }, [tRGB, flagRealtime])

    // 2Dスライダー更新処理
    useEffect(() => {
        // 値のチェック
        const tRGB_ = { 0: tTest2D[0], 1: tTest2D[1], 2: tRGB[2] }
        const [flag, tNewRGB] = normalizeRGB([tRGB_[0], tRGB_[1], tRGB_[2]])
        if (flag) {
            setTest2D([tNewRGB[0], tNewRGB[1]])
            return
        }

        // 値の更新
        setRGB(tRGB_)
    }, [tTest2D, flagRealtime])

    // スライダー画像の更新
    useEffect(() => {
        // 1Dスライダー
        if (flagRealtime) {
            const tRedSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [Math.round(x * 255), tRGB[1], tRGB[2]])
            const tGreenSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [tRGB[0], Math.round(x * 255), tRGB[2]])
            const tBlueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [tRGB[0], tRGB[1], Math.round(x * 255)])
            setSliderPixels([tRedSliderPixel, tGreenSliderPixel, tBlueSliderPixel])
        } else {
            const tRedSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [Math.round(x * 255), 0, 0])
            const tGreenSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [0, Math.round(x * 255), 0])
            const tBlueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [0, 0, Math.round(x * 255)])
            setSliderPixels([tRedSliderPixel, tGreenSliderPixel, tBlueSliderPixel])
        }

        // 2Dスライダー
        if (flagRealtime) {
            const t2DSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 300, (x, y) => [Math.round(x * 255), Math.round(y * 255), tRGB[2]])
            set2DSliderPixels([t2DSliderPixel])
        } else {
            const t2DSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 300, (x, y) => [Math.round(x * 255), Math.round(y * 255), 0])
            set2DSliderPixels([t2DSliderPixel])
        }
    }, [tRGB, flagRealtime])

    return (
        <>
            <Slider1D value={tRGB[0] ?? 0} min={0} max={255} step={1} setValue={(v) => setRGB({ ...tRGB, 0: v })}>
                <ImageCanvas pixelData={tSliderPixels[0]} />
            </Slider1D>
            <Slider1D value={tRGB[1] ?? 0} min={0} max={255} step={1} setValue={(v) => setRGB({ ...tRGB, 1: v })}>
                <ImageCanvas pixelData={tSliderPixels[1]} />
            </Slider1D>
            <Slider1D value={tRGB[2] ?? 0} min={0} max={255} step={1} setValue={(v) => setRGB({ ...tRGB, 2: v })}>
                <ImageCanvas pixelData={tSliderPixels[2]} />
            </Slider1D>
            <Slider2D value={tTest2D} min={[0, 0]} max={[255, 255]} step={[1, 1]} setValue={(v) => setTest2D(v)}>
                <ImageCanvas pixelData={t2DSliderPixels[0]} />
            </Slider2D>
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
