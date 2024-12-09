/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { HorizontalFlex, InheritedSize, VerticalFlex } from "./Styles"
import { useEffect, useState } from "react"
import { PixelData, pixelUtil } from "./pixelUtil"
import { colorUtil } from "./colorUtil"
import { ImageCanvas } from "./ImageCanvas"
import { ColorSliderRGB } from "./ColorSliderRGB"
import { ColorSliderHSV } from "./ColorSliderHSV"

type ColorSliderMode = "RGB" | "HSV"

export const ColorSlider = ({ state, setState }: { state: AppState, setState: SetAppState }) => {
    const [tMode, setMode] = useState<ColorSliderMode>("RGB")
    const [tFlagRealtime, setFlagRealtime] = useState(false)
    // const [tInitialized, setInitialized] = useState(false)
    // const [tSliderPixels, setSliderPixels] = useState<PixelData[]>([])
    // const [tSliderValues, setSliderValues] = useState<{ [index: number]: number }>({})
    // const [tSliderMaxes, setSliderMaxes] = useState<{ [index: number]: number }>({})
    // const [tSliderMins, setSliderMins] = useState<{ [index: number]: number }>({})
    // const [tSliderThumbPositions, setSliderThumbPositions] = useState<{ [index: number]: number }>({})

    // // 初期化処理
    // useEffect(() => {
    //     if (tInitialized) return
    //     setMode("RGB")
    //     setInitialized(true)
    // })

    // // スライダー初期化処理
    // useEffect(() => {
    //     let tSliderPixels: PixelData[] = []

    //     switch (tMode) {
    //         case "RGB":
    //             if (!state.isColorSanitized()) {
    //                 console.log("Color not sanitized")
    //                 setSliderValues({ 0: 0, 1: 0, 2: 0 })
    //             } else {
    //                 setSliderValues({ 0: state.color[0], 1: state.color[1], 2: state.color[2] })
    //             }
    //             setSliderMaxes({ 0: 255, 1: 255, 2: 255 })
    //             setSliderMins({ 0: 0, 1: 0, 2: 0 })
    //             break
    //         case "HSV":
    //             if (state.color.length !== 3) {
    //                 setSliderValues({ 0: 0, 1: 0, 2: 0 })
    //             } else {
    //                 const tHSV = colorUtil.RGB2HSV(state.color)
    //                 setSliderValues({ 0: tHSV[0], 1: tHSV[1], 2: tHSV[2] })
    //             }
    //             setSliderMaxes({ 0: 360, 1: 1, 2: 1 })
    //             setSliderMins({ 0: 0, 1: 0, 2: 0 })
    //             break
    //     }
    //     setSliderPixels(tSliderPixels)
    //     console.log("Mode changed: ", tMode)
    // }, [tMode])

    // // スライダー値更新処理
    // useEffect(() => {
    //     // console.log("Slider values changed: ", tSliderValues)
    //     let tColor = [0, 0, 0]
    //     switch (tMode) {
    //         case "RGB":
    //             // 値のチェック
    //             let tRGB = [0, 0, 0]
    //             for (let i = 0; i < 3; i++) {
    //                 if (tSliderValues[i] === undefined) return
    //                 if (tSliderValues[i] < tSliderMins[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMins[i] }); return }
    //                 if (tSliderValues[i] > tSliderMaxes[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMaxes[i] }); return }
    //                 if (Math.round(tSliderValues[i]) !== tSliderValues[i]) { setSliderValues({ ...tSliderValues, [i]: Math.round(tSliderValues[i]) }); return }
    //                 tRGB[i] = tSliderValues[i]
    //             }
    //             tColor = tRGB

    //             // スライダー画像の生成
    //             if (tFlagRealtime) {
    //                 const tRedSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [Math.round(x * 255), tRGB[1], tRGB[2]])
    //                 const tGreenSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [tRGB[0], Math.round(x * 255), tRGB[2]])
    //                 const tBlueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [tRGB[0], tRGB[1], Math.round(x * 255)])
    //                 setSliderPixels([tRedSliderPixel, tGreenSliderPixel, tBlueSliderPixel])
    //             } else {
    //                 const tRedSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [Math.round(x * 255), 0, 0])
    //                 const tGreenSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [0, Math.round(x * 255), 0])
    //                 const tBlueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => [0, 0, Math.round(x * 255)])
    //                 setSliderPixels([tRedSliderPixel, tGreenSliderPixel, tBlueSliderPixel])
    //             }
    //             break
    //         case "HSV":
    //             let tHSV = [0, 0, 0]
    //             for (let i = 0; i < 3; i++) {
    //                 if (tSliderValues[i] === undefined) return
    //                 if (tSliderValues[i] < tSliderMins[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMins[i] }); return }
    //                 if (tSliderValues[i] > tSliderMaxes[i]) { setSliderValues({ ...tSliderValues, [i]: tSliderMaxes[i] }); return }
    //                 tHSV[i] = tSliderValues[i]
    //             }
    //             tColor = colorUtil.HSV2RGB(tHSV)

    //             if (tFlagRealtime) {
    //                 const tHueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([x * 360, tHSV[1], tHSV[2]]))
    //                 const tSaturationSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([tHSV[0], x, 1]))
    //                 const tValueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([tHSV[0], 0, x]))
    //                 setSliderPixels([tHueSliderPixel, tSaturationSliderPixel, tValueSliderPixel])
    //             } else {
    //                 const tHueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([x * 360, 1, 1]))
    //                 const tSaturationSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([0, x, 1]))
    //                 const tValueSliderPixel: PixelData = pixelUtil.GeneratePixelFromFunc(300, 1, (x, _) => colorUtil.HSV2RGB([0, 0, x]))
    //                 setSliderPixels([tHueSliderPixel, tSaturationSliderPixel, tValueSliderPixel])
    //             }
    //             break
    //     }
    //     setState(state.update({ color: tColor }))
    // }, [tSliderValues, tFlagRealtime])

    // const tSliderWidth = 720
    // const tSliderHeight = 16
    // const tSliderHandleRadius = 8

    // // スライダーハンドル移動処理
    // useEffect(() => {
    //     const tThumbPositions: { [index: number]: number } = {}
    //     for (let tKey in tSliderValues) {
    //         if (tSliderValues[tKey] === undefined) continue
    //         tThumbPositions[tKey] = (tSliderValues[tKey] - tSliderMins[tKey]) / (tSliderMaxes[tKey] - tSliderMins[tKey]) * tSliderWidth - tSliderHandleRadius
    //     }
    //     setSliderThumbPositions(tThumbPositions)
    // }, [tSliderValues])

    // const onSlide = (e: React.MouseEvent<HTMLElement, MouseEvent>, index: number) => {
    //     const tElement = e.currentTarget as HTMLElement
    //     const tRect = tElement.getBoundingClientRect()
    //     const tX = e.clientX - tRect.left
    //     setSliderValues({
    //         ...tSliderValues,
    //         [index]: Math.round((tX / tSliderWidth * (tSliderMaxes[index] - tSliderMins[index]) + tSliderMins[index]) * 100) / 100
    //     })
    // }

    // const tSlideThumbStyle = css({
    //     position: "absolute",
    //     width: tSliderHandleRadius * 2,
    //     height: tSliderHandleRadius * 2,
    //     pointerEvents: "none",
    //     backgroundColor: "white",
    //     border: "3px solid black",
    //     borderColor: "black",
    //     borderRadius: "50%",
    //     top: 0,
    //     boxSizing: "border-box",
    // })

    return (
        <div css={css(VerticalFlex)}>
            <div css={css(HorizontalFlex)}>
                <div css={css(HorizontalFlex, { margin: 5 })}>
                    <button onClick={() => setMode("RGB")}>RGB</button>
                    <button onClick={() => setMode("HSV")}>HSV</button>
                </div>
                <div css={css(HorizontalFlex, { margin: 5 })}>
                    <label>
                        <input
                            type="checkbox"
                            checked={tFlagRealtime}
                            onChange={(e) => setFlagRealtime(e.target.checked)}
                        />
                        リアルタイム色反映
                    </label>
                </div>
            </div>
            <p>スライダー上をドラッグして設定</p>
            {/* <ColorSliderRGB state={state} setState={setState} flagRealtime={tFlagRealtime} /> */}
            {/* <ColorSliderHSV state={state} setState={setState} flagRealtime={tFlagRealtime} /> */}
            {tMode === "RGB" &&
                <ColorSliderRGB state={state} setState={setState} flagRealtime={tFlagRealtime} />
            }
            {tMode === "HSV" &&
                <ColorSliderHSV state={state} setState={setState} flagRealtime={tFlagRealtime} />
            }
            {/* {tSliderPixels.map((pixelData, index) => (
                <div css={css(HorizontalFlex)} key={index}>
                    <div css={{ height: tSliderHeight, width: tSliderWidth, margin: 5, position: "relative" }}
                        onMouseDown={(e) => { onSlide(e, index) }}
                        onMouseMove={(e) => { if (e.buttons === 1) onSlide(e, index) }}
                        onDragStart={(e) => e.preventDefault()}
                    >
                        <div css={css(InheritedSize, { position: "absolute" })}>
                            <ImageCanvas pixelData={pixelData} />
                        </div>
                        <div css={css(tSlideThumbStyle, { left: tSliderThumbPositions[index] ?? 0 })} />
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
            ))} */}
        </div>
    )
}
