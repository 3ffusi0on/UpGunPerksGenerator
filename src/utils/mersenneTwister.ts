// MersenneTwister implementation for seeded random number generation
export class MersenneTwister {
  private mt: number[] = new Array(624)
  private index: number = 0

  constructor(seed: number) {
    this.mt[0] = seed >>> 0
    for (let i = 1; i < 624; i++) {
      this.mt[i] = (1812433253 * (this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)) + i) >>> 0
    }
  }

  // Extract a tempered pseudorandom number based on the index
  extract_number(): number {
    if (this.index === 0) {
      this.generate_numbers()
    }

    let y = this.mt[this.index]
    y = y ^ (y >>> 11)
    y = y ^ ((y << 7) & 2636928640)
    y = y ^ ((y << 15) & 4022730752)
    y = y ^ (y >>> 18)

    this.index = (this.index + 1) % 624
    return y >>> 0
  }

  // Generate an array of 624 untempered numbers
  private generate_numbers(): void {
    for (let i = 0; i < 624; i++) {
      const y = (this.mt[i] & 0x80000000) + (this.mt[(i + 1) % 624] & 0x7fffffff)
      this.mt[i] = this.mt[(i + 397) % 624] ^ (y >>> 1)

      if (y % 2 !== 0) {
        this.mt[i] = this.mt[i] ^ 2567483615
      }
    }
  }

  // Get random number in [0, 1) interval
  random(): number {
    return this.extract_number() / 4294967296
  }

  // Get random integer in [min, max) range
  getRandomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min) + min)
  }
}
