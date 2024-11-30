/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { CenterFlex, VerticalFlex } from "./Styles";

export function ColorIndicator({ color }: { color: number[] }) {
    const numbers2ColorCode = (aNumbers: number[]) => {
        return aNumbers.map((aNumber) => {
            const tHex = aNumber.toString(16)
            return tHex.length === 1 ? `0${tHex}` : tHex
        }).join('')
    }

    return (
        <div>
            {(color[0] !== undefined && color[1] !== undefined && color[2] !== undefined) ? (
                <div css={css(VerticalFlex, CenterFlex)}>
                    <div css={{ width: 60, height: 30, backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }} />
                    <div>{`#${numbers2ColorCode(color)}`}</div>
                </div>
            ) : (
                <div css={css(VerticalFlex, CenterFlex)}>
                    <div css={{ width: 60, height: 30, backgroundColor: '#888888' }} />
                    <div>null</div>
                </div>
            )
            }
        </div>
    )
}
