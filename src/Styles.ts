import { css } from "@emotion/react"

export const InheritedSize = css({
    width: 'inherit',
    height: 'inherit',
})

export const HorizontalFlex = css({
    display: 'flex',
    flexDirection: 'row',
})

export const VerticalFlex = css({
    display: 'flex',
    flexDirection: 'column',
})

export const CenterFlex = css({
    alignItems: 'center',
    justifyContent: 'center',
})

export const ColorWeak = css({
    color: 'black',
    backgroundColor: '#ddd',
})

export const SliderHandleRadius = 8

export const SlideThumbStyle = css({
    position: "absolute",
    width: SliderHandleRadius * 2,
    height: SliderHandleRadius * 2,
    pointerEvents: "none",
    backgroundColor: "white",
    border: "3px solid black",
    borderColor: "black",
    borderRadius: "50%",
    top: 0,
    boxSizing: "border-box",
})
