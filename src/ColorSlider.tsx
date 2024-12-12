/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { AppState, SetAppState } from "./appState"
import { HorizontalFlex, VerticalFlex } from "./Styles"
import { useState } from "react"
import { ColorSliderRGB } from "./ColorSliderRGB"
import { ColorSliderHSV } from "./ColorSliderHSV"
import { ColorSliderYUV } from "./ColorSliderYUV"

type ColorSliderMode = "RGB" | "HSV" | "YUV"

export const ColorSlider = ({ state, setState }: { state: AppState, setState: SetAppState }) => {
    const [tMode, setMode] = useState<ColorSliderMode>("RGB")
    const [tFlagRealtime, setFlagRealtime] = useState(false)

    const copyState: (() => AppState) = () => (state.update({})) // 更新ループを防ぐためにコピーを返す

    return (
        <div css={css(VerticalFlex)}>
            <div css={css(HorizontalFlex)}>
                <div css={css(HorizontalFlex, { margin: 5 })}>
                    <button onClick={() => setMode("RGB")}>RGB</button>
                    <button onClick={() => setMode("HSV")}>HSV</button>
                    <button onClick={() => setMode("YUV")}>YUV</button>
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
            {tMode === "RGB" &&
                <ColorSliderRGB state={copyState()} setState={setState} flagRealtime={tFlagRealtime} />
            }
            {tMode === "HSV" &&
                <ColorSliderHSV state={copyState()} setState={setState} flagRealtime={tFlagRealtime} />
            }
            {tMode === "YUV" &&
                <ColorSliderYUV state={copyState()} setState={setState} flagRealtime={tFlagRealtime} />
            }
        </div>
    )
}
