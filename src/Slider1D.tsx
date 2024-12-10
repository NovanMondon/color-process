/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { HorizontalFlex, InheritedSize, SliderHandleRadius, SliderHeight, SliderWidth, SlideThumbStyle } from "./Styles"
import { useEffect, useState } from "react"
import { ImageCanvas } from "./ImageCanvas"
import { PixelData } from "./pixelUtil"

export const Slider1D = (
    { setSliderValue, sliderValue, sliderMin, sliderMax, pixelData }:
        { setSliderValue: ((v: number) => void), sliderValue: number, sliderMin: number, sliderMax: number, pixelData: PixelData }
) => {
    const [tSliderThumbPosition, setSliderThumbPosition] = useState(0)

    // スライダーハンドル移動処理
    useEffect(() => {
        const tSliderThumbPosition = (sliderValue - sliderMin) / (sliderMax - sliderMin) * SliderWidth - SliderHandleRadius
        setSliderThumbPosition(tSliderThumbPosition)
    }, [sliderValue])

    const onSlide = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const tElement = e.currentTarget as HTMLElement
        const tRect = tElement.getBoundingClientRect()
        const tX = e.clientX - tRect.left
        setSliderValue(Math.round(tX / SliderWidth * (sliderMax - sliderMin)) + sliderMin)
    }

    return (
        <>
            <div css={css(HorizontalFlex)}>
                <div css={{ height: SliderHeight, width: SliderWidth, margin: 5, position: "relative" }}
                    onMouseDown={(e) => { onSlide(e) }}
                    onMouseMove={(e) => { if (e.buttons === 1) onSlide(e) }}
                    onDragStart={(e) => e.preventDefault()}
                >
                    <div css={css(InheritedSize, { position: "absolute" })}>
                        <ImageCanvas pixelData={pixelData} />
                    </div>
                    <div css={css(SlideThumbStyle, { left: tSliderThumbPosition })} />
                </div>
                <input css={{ width: "3em", margin: 5 }}
                    value={sliderValue}
                    onChange={(e) => {
                        const tValue = parseInt(e.target.value)
                        if (isNaN(tValue)) return
                        setSliderValue(tValue)
                    }}
                />
            </div>
        </>
    )
}
