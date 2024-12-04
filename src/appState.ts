
export type SetAppState = (aState: AppState) => void

export class AppState {
    image: HTMLImageElement | null = null
    color: number[] = []

    constructor(aOverride?: Partial<AppState>) {
        Object.assign(this, aOverride)
    }

    update(aOverride: Partial<AppState>) {
        return new AppState({ ...this, ...aOverride })
    }

    isColorSanitized(): boolean {
        return this.color.length === 3 && this.color.every(tValue => tValue >= 0 && tValue <= 255)
    }
}
