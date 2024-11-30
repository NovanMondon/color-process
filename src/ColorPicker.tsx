/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { HorizontalFlex } from "./Styles"
import { ColorIndicator } from "./ColorIndicator"
import { useState } from "react"


export function ColorPicker({ state, setState }: { state: AppState, setState: SetAppState }) {
    const [tPointedColor, setPointedColor] = useState([0, 0, 0])

    // ファイルを選択して画像を読み込む
    const handleFileChange = (aEvent: React.ChangeEvent<HTMLInputElement>) => {
        const tFile = aEvent.target.files?.[0]
        if (!tFile) return
        const tImage = new Image()
        tImage.src = URL.createObjectURL(tFile)
        tImage.onload = () => { setState(new AppState({ image: tImage })) }
    }

    // ファイルをドロップして画像を読み込む
    const handleDrop = (aEvent: React.DragEvent<HTMLDivElement>) => {
        aEvent.preventDefault()
        const tFile = aEvent.dataTransfer.files?.[0]
        if (!tFile) return
        const tImage = new Image()
        tImage.src = URL.createObjectURL(tFile)
        tImage.onload = () => { setState(new AppState({ image: tImage })) }
    }

    // カラーピッカー
    const pickColor = (_: React.MouseEvent<HTMLDivElement>) => {
        if (!tPointedColor) return
        setState(state.update({ color: tPointedColor }))
    }

    const pointColor = (aEvent: React.MouseEvent<HTMLDivElement>) => {
        if (!state.image) return

        const tImageElement = aEvent.currentTarget as HTMLImageElement
        const tRect = tImageElement.getBoundingClientRect()
        const tX = Math.round(aEvent.clientX - tRect.left)
        const tY = Math.round(aEvent.clientY - tRect.top)
        const tColor = getColor(tImageElement, tX, tY)
        if (tColor) setPointedColor(tColor)
    }

    const getColor = (aImageElement: HTMLImageElement, aX: number, aY: number) => {
        const tCanvas = document.createElement('canvas')
        tCanvas.width = aImageElement.width
        tCanvas.height = aImageElement.height
        const tContext = tCanvas.getContext('2d')
        if (!tContext) return
        tContext.drawImage(aImageElement, 0, 0)
        const tImageData = tContext.getImageData(0, 0, aImageElement.width, aImageElement.height)
        const tData = tImageData.data
        const tIndex = (aY * aImageElement.width + aX) * 4
        return [tData[tIndex], tData[tIndex + 1], tData[tIndex + 2]]
    }

    return (
        <>
            <div css={css(HorizontalFlex)}>
                <div css={{ height: 750, width: 750 }}>
                    <input type="file" onChange={handleFileChange} />
                    <div css={css({ border: '1px solid black', overflow: 'scroll', height: 720, width: 720 })}
                        onDrop={handleDrop}
                        onDragOver={(aEvent) => aEvent.preventDefault()}
                    >
                        {state.image &&
                            <img css={{ pointerEvents: 'auto', cursor: 'pointer' }}
                                src={state.image.src}
                                alt="dropped"
                                onClick={pickColor}
                                onMouseMove={pointColor}
                            />
                        }
                    </div>
                </div>
                <div css={{ padding: 10 }}>
                    <h3>Pointed Color</h3>
                    <ColorIndicator color={tPointedColor} />
                </div>
            </div>
        </>
    )
}
