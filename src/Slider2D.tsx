/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { HorizontalFlex, InheritedSize, SliderHandleRadius, SlideThumbStyle, VerticalFlex } from "./Styles"
import { useEffect, useState } from "react"
import { MathUtil } from "./mathUtil"


export type Slider2DProps = {
    setValue: ((v: [number, number]) => void)
    value: [number, number]
    min: [number, number]
    max: [number, number]
    step: [number, number]
    children: React.ReactNode
}

const SliderWidth2D = 480
const SliderHeight2D = 480

export const Slider2D = (
    { setValue, value: aValue, min: aMin, max: aMax, step: aStep, children: aChildren }: Slider2DProps
) => {
    const [tSliderThumbPosition, setSliderThumbPosition] = useState([0, 0])

    const onSlide = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const tElement = e.currentTarget as HTMLElement
        const tRect = tElement.getBoundingClientRect()
        const tX = e.clientX - tRect.left
        const tY = e.clientY - tRect.top
        const tValue1 = MathUtil.roundToWithStep(tX / SliderWidth2D * (aMax[0] - aMin[0]) + aMin[0], aStep[0])
        const tValue2 = MathUtil.roundToWithStep(tY / SliderHeight2D * (aMax[1] - aMin[1]) + aMin[1], aStep[1])
        setValue([tValue1, tValue2])
    }

    // スライダーハンドル移動処理
    useEffect(() => {
        const tSliderThumbPosition = [(aValue[0] - aMin[0]) / (aMax[0] - aMin[0]) * SliderWidth2D - SliderHandleRadius, (aValue[1] - aMin[1]) / (aMax[1] - aMin[1]) * SliderHeight2D - SliderHandleRadius]
        setSliderThumbPosition(tSliderThumbPosition)
    }, [aValue])

    return (
        <>
            <div css={css(HorizontalFlex)}>
                <div css={css({ height: SliderHeight2D, width: SliderWidth2D, position: "relative" })}
                    onMouseDown={(e) => { onSlide(e) }}
                    onMouseMove={(e) => { if (e.buttons === 1) onSlide(e) }}
                    onDragStart={(e) => e.preventDefault()}
                >
                    <div css={css(InheritedSize, { position: "absolute" })}>
                        {aChildren}
                    </div>
                    <div css={css(SlideThumbStyle, { left: tSliderThumbPosition[0], top: tSliderThumbPosition[1] })} />
                </div>
                <div css={css(VerticalFlex)}>
                    <input css={{ width: "3em", margin: 5 }}
                        value={aValue[0]}
                        onChange={(e) => {
                            const tValue = parseInt(e.target.value)
                            if (isNaN(tValue)) return
                            setValue([tValue, aValue[1]])
                        }}
                    />
                    <input css={{ width: "3em", margin: 5 }}
                        value={aValue[1]}
                        onChange={(e) => {
                            const tValue = parseInt(e.target.value)
                            if (isNaN(tValue)) return
                            setValue([aValue[0], tValue])
                        }}
                    />
                </div>
            </div>
        </>
    )
}
