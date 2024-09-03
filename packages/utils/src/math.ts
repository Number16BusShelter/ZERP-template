

export function updateAverage(previousAverage: number, previousLength: number, newValue: number): number {
    return ((previousAverage * previousLength) + newValue) / (previousLength + 1);
}
