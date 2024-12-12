/** @jsxImportSource @emotion/react */

import { AppState, SetAppState } from "./appState"
import { ColorSliderComponent } from "./ColorSliderComponent"

const RGB_MAX = [255, 255, 255]
const RGB_MIN = [0, 0, 0]
const RGB_STEP = [1, 1, 1]
const RGB_INIT = { 0: 0, 1: 0, 2: 0 }

function normalizeRGB(rgb: number[]): [boolean, number[]] {
    if (rgb.length !== 3) {
        return [true, [0, 0, 0]]
    }
    let tFlag = false
    let tRGB = [...rgb]
    for (let i = 0; i < 3; i++) {
        if (rgb[i] < 0) {
            tRGB[i] = 0
            tFlag = true
        } else if (rgb[i] > 255) {
            tRGB[i] = 255
            tFlag = true
        } else if (Math.floor(rgb[i]) !== rgb[i]) {
            tRGB[i] = Math.round(rgb[i])
            tFlag = true
        }
    }
    return [tFlag, tRGB]
}

export const ColorSliderRGB = ({ state, setState, flagRealtime }: { state: AppState, setState: SetAppState, flagRealtime: boolean }) => {
    return (
        <>
            <ColorSliderComponent
                state={state}
                setState={setState}
                flagRealtime={flagRealtime}
                valueMax={RGB_MAX}
                valueMin={RGB_MIN}
                valueStep={RGB_STEP}
                valueInit={RGB_INIT}
                value2Color={(value) => [value[0], value[1], value[2]]}
                color2Value={(color) => ({ 0: color[0], 1: color[1], 2: color[2] })}
                normalizeValue={(value) => normalizeRGB([value[0], value[1], value[2]])}
            />
        </>
    )
}
