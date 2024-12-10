/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { HorizontalFlex, InheritedSize, SliderHandleRadius, SliderHeight, SliderWidth, SlideThumbStyle } from "./Styles"
import { useEffect, useState } from "react"
import { MathUtil } from "./mathUtil"

export type Slider1DProps = {
    setSliderValue: ((v: number) => void)
    sliderValue: number
    sliderMin: number
    sliderMax: number
    sliderStep: number
    children: React.ReactNode
}

export const Slider1D = (
    { setSliderValue, sliderValue, sliderMin, sliderMax, sliderStep, children }: Slider1DProps) => {
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
        setSliderValue(MathUtil.roundToWithStep(tX / SliderWidth * (sliderMax - sliderMin) + sliderMin, sliderStep))
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
                        {children}
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
