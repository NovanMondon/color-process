export const MathUtil = {
    roundTo: (value: number, digits: number) => {
        const t = Math.pow(10, digits)
        return Math.round(value * t) / t
    },

    roundToWithStep: (value: number, step: number) => {
        return Math.round(value / step) * step
    }
}
