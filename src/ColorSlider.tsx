/** @jsxImportSource @emotion/react */

import { AppState, SetAppState } from "./appState"

export const ColorSlider = ({ state, setState }: { state: AppState, setState: SetAppState }) => {

    return (
        <div>
            <button onClick={() => setState(state.update({ color: [255, 0, 0] }))}>赤</button>
        </div>
    )
}
