/**
 * Returns the appropriate Tailwind CSS color class based on the perk type
 */
export const getCategoryColorClass = (type: string) => {
  switch (type.toLowerCase()) {
    case 'arme':
      return 'bg-amber-200'
    case 'couteau':
      return 'bg-pink-400'
    case 'extension':
    case 'extensionarme':
      return 'bg-yellow-400'
    case 'grenade':
      return 'bg-green-800'
    case 'laser':
      return 'bg-zinc-300'
    case 'personnage':
      return 'bg-gray-400'
    case 'autres':
      return 'bg-red-700'
    default:
      return 'bg-blue-600'
  }
}
