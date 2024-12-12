// RGB: [[0, 255], [0, 255], [0, 255]]
// HSV: [(-inf, inf), [0, 1], [0, 1]]
// YUV: [[0, 255], [1, 255], [1, 255]]
//

export const colorUtil = {
    RGB2HSV: (aColor: number[]): number[] => {
        const [r, g, b] = aColor.map(x => x / 255)
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const v = max
        const s = max === 0 ? 0 : (max - min) / max
        const h = max === min ? 0 : max === r ? (g - b) / (max - min) * 60 : max === g ? (b - r) / (max - min) * 60 + 120 : (r - g) / (max - min) * 60 + 240
        return [h, s, v]
    },

    HSV2RGB: (aColor: number[]): number[] => {
        let [h, s, v] = aColor
        if (h >= 360) h -= 360
        if (h < 0) h += 360

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
    },

    YUV2RGB: (aColor: number[]): number[] => {
        const [y, u, v] = aColor
        const tU = u - 128
        const tV = v - 128
        const r = y + 1.13983 * tV
        const g = y - 0.39465 * tU - 0.58060 * tV
        const b = y + 2.03211 * tU
        const r_ = r < 0 ? 0 : r > 255 ? 255 : Math.round(r)
        const g_ = g < 0 ? 0 : g > 255 ? 255 : Math.round(g)
        const b_ = b < 0 ? 0 : b > 255 ? 255 : Math.round(b)

        return [r_, g_, b_]
    },

    RGB2YUV: (aColor: number[]): number[] => {
        const [r, g, b] = aColor
        const y = 0.299 * r + 0.587 * g + 0.114 * b
        const u = -0.14713 * r - 0.28886 * g + 0.436 * b + 128
        const v = 0.615 * r - 0.51499 * g - 0.10001 * b + 128
        const y_ = y < 0 ? 0 : y > 255 ? 255 : Math.round(y)
        const u_ = u < 1 ? 1 : u > 255 ? 255 : Math.round(u)
        const v_ = v < 1 ? 1 : v > 255 ? 255 : Math.round(v)

        return [y_, u_, v_]
    }
}
