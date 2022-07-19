export interface UniformEvent {
    event: string
    params: {
        name: string | number | string[] | number[]
        value: string | number | string[] | number[]
    }
}
