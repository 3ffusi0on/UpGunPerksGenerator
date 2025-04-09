export class SeededRandom {
  private seed: number
  private initialSeed: number

  constructor(seed: string) {
    this.initialSeed = this.hashCode(seed)
    this.seed = this.initialSeed
  }

  private hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  reset(): void {
    this.seed = this.initialSeed
  }

  next(): number {
    const a = 1664525
    const c = 1013904223
    const m = Math.pow(2, 32)

    this.seed = (a * this.seed + c) % m
    return this.seed / m
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min) + min)
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }
}
