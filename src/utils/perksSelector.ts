import perksData from '../data/perks.json'
import { Perks } from '../types/perks'

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

  resetUsedPerks(): void {
    this.usedPerks.clear()
  }

  getAvailablePerkCount(): number {
    return this.perks.length - this.usedPerks.size
  }
}
