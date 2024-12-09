/** @jsxImportSource @emotion/react */

import { useEffect, useState } from "react"
import { ColorPicker } from "./ColorPicker"
import { AppState } from "./appState"
import { ColorIndicator } from "./ColorIndicator"
import { css } from "@emotion/react"
import { CenterFlex, ColorWeak, HorizontalFlex, VerticalFlex } from "./Styles"
import { ColorSlider } from "./ColorSlider"

type AppMode = "ColorPicker" | "ColorSlider"

function App() {
  const [tState, setState] = useState(new AppState())
  const [tMode, setMode] = useState<AppMode>("ColorPicker")

  // Debug
  useEffect(() => {
    console.log(tState)
  }, [tState])

  return (
    <>
      <div css={css(VerticalFlex)}>
        <header css={css(HorizontalFlex, CenterFlex, ColorWeak)}>
          <h1>Color Process</h1>
        </header>
        <div css={css(HorizontalFlex)}>
          <aside css={css(VerticalFlex, { padding: 10, width: 160 })}>
            <ColorIndicator color={tState.color} />
            <button onClick={() => setMode("ColorPicker")}>カラーピッカー</button>
            <button onClick={() => setMode("ColorSlider")}>カラースライダー</button>
          </aside>
          <main>
            <div css={{ padding: 10 }}>
              {tMode === "ColorPicker" &&
                <ColorPicker state={tState} setState={setState} />
              }
              {tMode === "ColorSlider" &&
                <ColorSlider state={tState} setState={setState} />
              }
            </div>
          </main>
        </div>
        <footer css={css(HorizontalFlex, CenterFlex, ColorWeak)}>
          <p>Color Process</p>
        </footer>
      </div >
    </>
  )
}

export default App
