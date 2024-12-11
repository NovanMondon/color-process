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
        for (let i = 0; i < 3; i++) {
            if (!tRGB[i] && tRGB[i] !== 0) {
                setRGB({ ...tRGB, [i]: 0 })
                return
            }
            if (tRGB[i] < 0) {
                setRGB({ ...tRGB, [i]: 0 })
                return
            }
            if (tRGB[i] > 255) {
                setRGB({ ...tRGB, [i]: 255 })
                return
            }
            if (Math.round(tRGB[i]) !== tRGB[i]) {
                setRGB({ ...tRGB, [i]: Math.round(tRGB[i]) })
                return
            }
        }

        // スライダー画像の更新
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

        // 色の更新
        setState(state.update({ color: [tRGB[0], tRGB[1], tRGB[2]] }))
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
            <Slider2D value={tTest2D} min={[0, 0]} max={[1, 1]} step={[0.01, 0.01]} setValue={(v) => setTest2D(v)}>
                <div>2D</div>
            </Slider2D>
        </>
    )
}
