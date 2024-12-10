/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"
import { HorizontalFlex, InheritedSize } from "./Styles"
import { ImageCanvas } from "./ImageCanvas"
import { Slider1D } from "./Slider1D"

export const ColorSliderRGB = ({ state, setState, flagRealtime }: { state: AppState, setState: SetAppState, flagRealtime: boolean }) => {
    const [tSliderPixels, setSliderPixels] = useState<PixelData[]>([])
    const [tSliderValues, setSliderValues] = useState<{ [index: number]: number }>({ 0: 0, 1: 0, 2: 0 })
    const [tSliderThumbPositions, setSliderThumbPositions] = useState<{ [index: number]: number }>({})

    // 初期化処理
    useEffect(() => {
        console.log("ColorSliderRGB")
        if (!state.isColorSanitized()) {
            console.log("Color not sanitized")
        } else {
            setSliderValues({ 0: state.color[0], 1: state.color[1], 2: state.color[2] })
        }
    }, [])

    // スライダー更新処理
    useEffect(() => {
        // 値のチェック
        let tRGB = [0, 0, 0]
        for (let i = 0; i < 3; i++) {
            if (!tSliderValues[i] && tSliderValues[i] !== 0) {
                setSliderValues({ ...tSliderValues, [i]: 0 })
                return
            }
            if (tSliderValues[i] < 0) {
                setSliderValues({ ...tSliderValues, [i]: 0 })
                return
            }
            if (tSliderValues[i] > 255) {
                setSliderValues({ ...tSliderValues, [i]: 255 })
                return
            }
            if (Math.round(tSliderValues[i]) !== tSliderValues[i]) {
                setSliderValues({ ...tSliderValues, [i]: Math.round(tSliderValues[i]) })
                return
            }
            tRGB[i] = tSliderValues[i]
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
        setState(state.update({ color: tRGB }))
    }, [tSliderValues, flagRealtime])

    const tSliderWidth = 720
    const tSliderHeight = 16
    const tSliderHandleRadius = 8

    // スライダーハンドル移動処理
    useEffect(() => {
        const tThumbPositions: { [index: number]: number } = {}
        for (let tKey in tSliderValues) {
            if (tSliderValues[tKey] === undefined) continue
            tThumbPositions[tKey] = tSliderValues[tKey] / 255 * tSliderWidth - tSliderHandleRadius
        }
        setSliderThumbPositions(tThumbPositions)
    }, [tSliderValues])

    const onSlide = (e: React.MouseEvent<HTMLElement, MouseEvent>, index: number) => {
        const tElement = e.currentTarget as HTMLElement
        const tRect = tElement.getBoundingClientRect()
        const tX = e.clientX - tRect.left
        setSliderValues({
            ...tSliderValues,
            [index]: Math.round(tX / tSliderWidth * 255)
        })
    }

    const tSlideThumbStyle = css({
        position: "absolute",
        width: tSliderHandleRadius * 2,
        height: tSliderHandleRadius * 2,
        pointerEvents: "none",
        backgroundColor: "white",
        border: "3px solid black",
        borderColor: "black",
        borderRadius: "50%",
        top: 0,
        boxSizing: "border-box",
    })

    return (
        <>
            {tSliderPixels.map((tPixelData, tIndex) => (
                <Slider1D
                    pixelData={tPixelData}
                    sliderValue={tSliderValues[tIndex] ?? 0}
                    sliderMin={0}
                    sliderMax={255}
                    setSliderValue={(v) => setSliderValues({ ...tSliderValues, [tIndex]: v })}
                />
            ))}
        </>
    )
}
