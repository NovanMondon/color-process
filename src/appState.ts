
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
}
