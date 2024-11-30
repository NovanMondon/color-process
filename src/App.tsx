/** @jsxImportSource @emotion/react */

import { useEffect, useState } from "react"
import { ColorPicker } from "./ColorPicker"
import { AppState } from "./appState"
import { ColorIndicator } from "./ColorIndicator"
import { css } from "@emotion/react"
import { CenterFlex, ColorWeak, HorizontalFlex, VerticalFlex } from "./Styles"

function App() {
  const [tState, setState] = useState(new AppState())

  // Debug
  useEffect(() => {
    console.log(tState)
  }, [tState])

  return (
    <>
      <div css={css(VerticalFlex)}>
        <header css={css(HorizontalFlex, CenterFlex, ColorWeak)}>
          <h1>Color Picker</h1>
        </header>
        <div css={css(HorizontalFlex)}>
          <aside css={{ padding: 10, width: 240 }}>
            <ColorIndicator color={tState.color} />
          </aside>
          <main>
            <div css={{ padding: 10, height: 720, width: 720 }}>
              <ColorPicker state={tState} setState={setState} />
            </div>
          </main>
        </div>
        <footer css={css(HorizontalFlex, CenterFlex, ColorWeak)}>
          <p>Color Picker</p>
        </footer>
      </div >
    </>
  )
}

export default App
