export const MathUtil = {
    roundTo: (value: number, digits: number) => {
        const t = Math.pow(10, digits)
        return Math.round(value * t) / t
    }
}
