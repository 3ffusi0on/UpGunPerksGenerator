import perksData from '../data/perks.json'
import { Perks } from '../types/perks'
import { MersenneTwister } from './mersenneTwister'
import { SeededRandom } from './seededRandom'

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
