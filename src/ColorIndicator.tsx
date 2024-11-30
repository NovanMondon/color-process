/** @jsxImportSource @emotion/react */

export function ColorIndicator({ color }: { color: number[] }) {
    return (
        <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div css={{ width: 100, height: 100, backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }} />
            <div>{`rgb(${color[0]}, ${color[1]}, ${color[2]})`}</div>
        </div>
    )
}
