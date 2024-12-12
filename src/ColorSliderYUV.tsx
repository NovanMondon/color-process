/** @jsxImportSource @emotion/react */

import { AppState, SetAppState } from "./appState"
import { ColorSliderComponent } from "./ColorSliderComponent"
import { colorUtil } from "./colorUtil"

const YUV_MAX = [255, 255, 255]
const YUV_MIN = [0, 1, 1]
const YUV_STEP = [1, 1, 1]
const YUV_INIT = { 0: 255, 1: 128, 2: 128 }

function normalizeYUV(yuv: number[]): [boolean, number[]] {
    if (yuv.length !== 3) {
        return [true, [0, 0, 0]]
    }
    let tFlag = false
    let tYUV = [...yuv]
    for (let i = 0; i < 3; i++) {
        if (yuv[i] < 0) {
            tYUV[i] = 0
            tFlag = true
        } else if (yuv[i] > 255) {
            tYUV[i] = 255
            tFlag = true
        } else if (Math.floor(yuv[i]) !== yuv[i]) {
            tYUV[i] = Math.round(yuv[i])
            tFlag = true
        }
    }
    return [tFlag, tYUV]
}

export const ColorSliderYUV = ({ state, setState, flagRealtime }: { state: AppState, setState: SetAppState, flagRealtime: boolean }) => {
    return (
        <>
            <ColorSliderComponent
                state={state}
                setState={setState}
                flagRealtime={flagRealtime}
                valueMax={YUV_MAX}
                valueMin={YUV_MIN}
                valueStep={YUV_STEP}
                valueInit={YUV_INIT}
                value2Color={(value) => colorUtil.YUV2RGB([value[0], value[1], value[2]])}
                color2Value={(color) => colorUtil.RGB2YUV([color[0], color[1], color[2]])}
                normalizeValue={(value) => normalizeYUV([value[0], value[1], value[2]])}
            />
        </>
    )
}
