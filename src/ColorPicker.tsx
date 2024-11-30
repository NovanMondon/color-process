/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { InheritedSize } from "./Styles"


export function ColorPicker({ state, setState }: { state: AppState, setState: SetAppState }) {
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
    const pickColor = (aEvent: React.MouseEvent<HTMLDivElement>) => {
        if (!state.image) return

        const tImageElement = aEvent.currentTarget as HTMLImageElement
        const tRect = tImageElement.getBoundingClientRect()
        const tTop = tRect.top
        const tLeft = tRect.left

        const tCanvas = document.createElement('canvas')
        tCanvas.width = state.image.width
        tCanvas.height = state.image.height
        const tContext = tCanvas.getContext('2d')
        if (!tContext) return
        tContext.drawImage(state.image, 0, 0)
        const tImageData = tContext.getImageData(0, 0, state.image.width, state.image.height)
        const tData = tImageData.data

        const tX = Math.round(aEvent.clientX - tLeft)
        const tY = Math.round(aEvent.clientY - tTop)
        // console.log(tTop, tLeft, aEvent.clientX, aEvent.clientY, tX, tY)
        // console.log(tRect.bottom, tRect.right, tRect.width, tRect.height, state.image.width, state.image.height)
        const tIndex = (tY * state.image.width + tX) * 4
        // console.log(tData.length, tIndex)
        const tColor = [tData[tIndex], tData[tIndex + 1], tData[tIndex + 2]]
        setState({ ...state, color: tColor })
    }

    return (
        <>
            <div css={css(InheritedSize)}>
                <input type="file" onChange={handleFileChange} />
                <div css={css(InheritedSize, { border: '1px solid black', overflow: 'scroll' })}
                    onDrop={handleDrop}
                    onDragOver={(aEvent) => aEvent.preventDefault()}
                >
                    {state.image &&
                        <img css={{ pointerEvents: 'auto', cursor: 'pointer' }}
                            src={state.image.src}
                            alt="dropped"
                            onClick={pickColor}
                        />
                    }
                </div>
            </div>
        </>
    )
}
