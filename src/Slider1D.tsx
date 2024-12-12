/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { HorizontalFlex, InheritedSize, SliderHandleRadius, SlideThumbStyle } from "./Styles"
import { useEffect, useState } from "react"
import { MathUtil } from "./mathUtil"

export type Slider1DProps = {
    setValue: ((v: number) => void)
    value: number
    min: number
    max: number
    step: number
    children: React.ReactNode
}

const SliderWidth = 720
const SliderHeight = 16

export const Slider1D = (
    { setValue, value: aValue, min: aMin, max: aMax, step: aStep, children: aChildren }: Slider1DProps
) => {
    const [tSliderThumbPosition, setSliderThumbPosition] = useState(0)

    const onSlide = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const tElement = e.currentTarget as HTMLElement
        const tRect = tElement.getBoundingClientRect()
        const tX = e.clientX - tRect.left
        setValue(MathUtil.roundToWithStep(tX / SliderWidth * (aMax - aMin) + aMin, aStep))
    }

    // スライダーハンドル移動処理
    useEffect(() => {
        const tSliderThumbPosition = (aValue - aMin) / (aMax - aMin) * SliderWidth - SliderHandleRadius
        setSliderThumbPosition(tSliderThumbPosition)
    }, [aValue])

    return (
        <>
            <div css={css(HorizontalFlex)}>
                <div css={{ height: SliderHeight, width: SliderWidth, margin: 5, position: "relative" }}
                    onMouseDown={(e) => { onSlide(e) }}
                    onMouseMove={(e) => { if (e.buttons === 1) onSlide(e) }}
                    onDragStart={(e) => e.preventDefault()}
                >
                    <div css={css(InheritedSize, { position: "absolute" })}>
                        {aChildren}
                    </div>
                    <div css={css(SlideThumbStyle, { left: tSliderThumbPosition })} />
                </div>
                <input css={{ width: "3em", margin: 5 }}
                    value={aValue}
                    onChange={(e) => {
                        const tValue = parseInt(e.target.value)
                        if (isNaN(tValue)) return
                        if (aValue !== tValue) setValue(tValue)
                    }}
                />
            </div>
        </>
    )
}
