
export class AppState {
    image: HTMLImageElement | null = null
    color: number[] = [0, 0, 0]

    constructor(aOverride?: Partial<AppState>) {
        Object.assign(this, aOverride)
    }
}
