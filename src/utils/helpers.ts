const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min
}

const formatSeconds = (secondsCount: number): string => {
    return [3600, 60]
        .reduceRight(
            (p, b) => (r: number) => [Math.floor(r / b)].concat(p(r % b)),
            (r: any) => [r]
        )(secondsCount)
        .map((a: any) => a.toString().padStart(2, '0'))
        .join(':')
}

export { randomNumber, formatSeconds }
