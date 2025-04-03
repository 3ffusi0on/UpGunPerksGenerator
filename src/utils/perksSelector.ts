import perksData from '../data/perks.json'
import { Perks } from '../types/perks'

// MersenneTwister implementation for seeded random number generation
class MersenneTwister {
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

class SeededRandom {
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

export class PerkSelector {
  private perks: Perks[] = []
  private usedPerks = new Set<string>()
  private rng: SeededRandom | null = null
  private lastSeed: string = ''

  constructor() {
    try {
      this.perks = perksData
    } catch (error) {
      console.error('Error processing perk list:', error)
      this.perks = []
    }
  }

  setSeed(seed: string): void {
    if (this.lastSeed !== seed) {
      this.usedPerks.clear()
      this.lastSeed = seed
      this.rng = new SeededRandom(seed)
    } else if (this.rng) {
      this.rng.reset()
    }
  }

  selectRandomPerks(count: number, seed?: string): Perks[] {
    if (seed) {
      this.setSeed(seed)
    }

    if (count > this.perks.length) {
      throw new Error(`Cannot select ${count} perks, only ${this.perks.length} perks available`)
    }

    if (this.rng && seed) {
      this.usedPerks.clear()

      const shuffledPerks = this.rng.shuffle(this.perks)

      return shuffledPerks.slice(0, count)
    }

    const availablePerks = this.perks.filter(perk => !this.usedPerks.has(perk.name))
    if (count > availablePerks.length) {
      this.usedPerks.clear()
      availablePerks.push(...this.perks)
    }

    const selectedPerks: Perks[] = []
    while (selectedPerks.length < count) {
      const randomValue = this.rng?.next() ?? Math.random()
      const randomIndex = Math.floor(randomValue * availablePerks.length)
      const perk = availablePerks[randomIndex]

      if (!this.usedPerks.has(perk.name)) {
        selectedPerks.push(perk)
        this.usedPerks.add(perk.name)
        availablePerks.splice(randomIndex, 1)
      }
    }

    return selectedPerks
  }

  selectSinglePerkOfType(perkType: string, seed?: string, excludePerks: string[] = []): Perks {
    const seedRng = seed ? new MersenneTwister(this.hashSeed(seed)) : null

    if (typeof excludePerks === 'string') {
      excludePerks = [excludePerks]
    }

    const typeFilteredPerks = this.perks.filter(
      (p: Perks) => p.type === perkType && !excludePerks.includes(p.name),
    )

    if (typeFilteredPerks.length === 0) {
      const fallbackPerks = this.perks.filter((p: Perks) => p.type === perkType)

      if (fallbackPerks.length === 0) {
        throw new Error(`No perks available for type ${perkType}`)
      }

      return this.getRandomElement(fallbackPerks, seedRng)
    }

    const selectedPerk = this.getRandomElement(typeFilteredPerks, seedRng)
    this.usedPerks.add(selectedPerk.name)

    return selectedPerk
  }

  // Hash a seed string to a number for MersenneTwister
  private hashSeed(seed: string): number {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  // Get a random element from an array
  private getRandomElement<T>(array: T[], rng: MersenneTwister | null = null): T {
    if (array.length === 0) {
      throw new Error('Cannot get random element from empty array')
    }

    const index = rng ? rng.getRandomInt(0, array.length) : Math.floor(Math.random() * array.length)

    return array[index]
  }

  resetUsedPerks(): void {
    this.usedPerks.clear()
  }

  getAvailablePerkCount(): number {
    return this.perks.length - this.usedPerks.size
  }
}
