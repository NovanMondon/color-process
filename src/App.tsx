/** @jsxImportSource @emotion/react */

import { useEffect, useState } from "react"
import { ColorPicker } from "./ColorPicker"
import { AppState } from "./appState"
import { ColorIndicator } from "./ColorIndicator"

function App() {
  const [tState, setState] = useState(new AppState())

  // Debug
  useEffect(() => {
    console.log(tState)
  }, [tState])

  return (
    <>
      <div css={{ height: 720, width: 720 }}>
        <ColorPicker state={tState} setState={setState} />
      </div>
      <ColorIndicator color={tState.color} />
    </>
  )
}

export default App
