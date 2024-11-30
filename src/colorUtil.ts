export const colorUtil = {
    RGB2HSV: (aColor: number[]): number[] => {
        const [r, g, b] = aColor
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const v = max
        const s = max === 0 ? 0 : (max - min) / max
        const h = max === min ? 0 : max === r ? (g - b) / (max - min) * 60 : max === g ? (b - r) / (max - min) * 60 + 120 : (r - g) / (max - min) * 60 + 240
        return [h, s, v]
    },

    HSV2RGB: (aColor: number[]): number[] => {
        const [h, s, v] = aColor
        const c = v * s
        const hp = h / 60
        const x = c * (1 - Math.abs(hp % 2 - 1))
        const m = v - c

        let r = 0
        let g = 0
        let b = 0

        if (0 <= hp && hp < 1) {
            [r, g, b] = [c, x, 0]
        } else if (1 <= hp && hp < 2) {
            [r, g, b] = [x, c, 0]
        } else if (2 <= hp && hp < 3) {
            [r, g, b] = [0, c, x]
        } else if (3 <= hp && hp < 4) {
            [r, g, b] = [0, x, c]
        } else if (4 <= hp && hp < 5) {
            [r, g, b] = [x, 0, c]
        } else if (5 <= hp && hp < 6) {
            [r, g, b] = [c, 0, x]
        }

        return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
    }
}
