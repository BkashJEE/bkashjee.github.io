import rawUseCases from './use-cases.json'

export const useCaseCategories = [
  { id: 'ai-agents', label: 'AI agents' },
  { id: 'automations', label: 'Automations' },
  { id: 'research-data', label: 'Research and data' },
  { id: 'content-media', label: 'Content and media' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'experiments', label: 'Experiments' },
] as const

export const useCaseStatuses = ['idea', 'testing', 'working', 'archived'] as const

export type UseCaseCategory = (typeof useCaseCategories)[number]['id']
export type UseCaseStatus = (typeof useCaseStatuses)[number]

export interface UseCaseImage {
  src: string
  width: number
  height: number
  alt: string
}

export interface UseCaseOutcome {
  value: string
  label: string
}

export interface UseCaseEntry {
  slug: string
  title: string
  description: string
  category: UseCaseCategory
  tools: string[]
  keywords: string[]
  image: UseCaseImage
  screenshots: UseCaseImage[]
  status: UseCaseStatus
  sourcePrivate: boolean
  featured: boolean
  date: string
  problem: string
  solution: string
  workflow: string[]
  outcomes: UseCaseOutcome[]
  limitations: string[]
  links?: {
    demo?: string
    source?: string
    post?: string
  }
  related: string[]
}

const categoryIds = new Set<string>(useCaseCategories.map((category) => category.id))
const statusIds = new Set<string>(useCaseStatuses)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasText(record: Record<string, unknown>, key: string): boolean {
  return typeof record[key] === 'string' && record[key].trim().length > 0
}

function isTextArray(value: unknown, minimum = 1): value is string[] {
  return Array.isArray(value) && value.length >= minimum && value.every((item) => typeof item === 'string' && item.trim().length > 0)
}

function isImage(value: unknown): value is UseCaseImage {
  return isRecord(value)
    && hasText(value, 'src')
    && hasText(value, 'alt')
    && typeof value.width === 'number'
    && value.width > 0
    && typeof value.height === 'number'
    && value.height > 0
}

function validateUseCases(value: unknown): UseCaseEntry[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error('Use-case content must be a non-empty array.')

  const slugs = new Set<string>()
  for (const [index, entry] of value.entries()) {
    if (!isRecord(entry)) throw new Error(`Use case ${index + 1} must be an object.`)
    for (const key of ['slug', 'title', 'description', 'date', 'problem', 'solution']) {
      if (!hasText(entry, key)) throw new Error(`Use case ${index + 1} is missing required field “${key}”.`)
    }
    const slug = entry.slug as string
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Use case slug “${slug}” is invalid.`)
    if (slugs.has(slug)) throw new Error(`Use case slug “${slug}” is duplicated.`)
    slugs.add(slug)
    if (!categoryIds.has(String(entry.category))) throw new Error(`Use case “${slug}” has an unknown category.`)
    if (!statusIds.has(String(entry.status))) throw new Error(`Use case “${slug}” has an unknown status.`)
    if (typeof entry.sourcePrivate !== 'boolean') throw new Error(`Use case “${slug}” must declare whether its source is private.`)
    if (typeof entry.featured !== 'boolean') throw new Error(`Use case “${slug}” must declare featured as true or false.`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date as string)) throw new Error(`Use case “${slug}” needs an ISO date.`)
    if (!isTextArray(entry.tools) || !isTextArray(entry.keywords) || !isTextArray(entry.workflow) || !isTextArray(entry.limitations)) {
      throw new Error(`Use case “${slug}” has an empty required list.`)
    }
    if (!isImage(entry.image) || !Array.isArray(entry.screenshots) || !entry.screenshots.every(isImage)) {
      throw new Error(`Use case “${slug}” has invalid image data.`)
    }
    if (!Array.isArray(entry.outcomes) || entry.outcomes.length === 0 || !entry.outcomes.every((outcome) => isRecord(outcome) && hasText(outcome, 'value') && hasText(outcome, 'label'))) {
      throw new Error(`Use case “${slug}” needs at least one measurable outcome.`)
    }
    if (!Array.isArray(entry.related) || !entry.related.every((related) => typeof related === 'string')) {
      throw new Error(`Use case “${slug}” has invalid related entries.`)
    }
  }

  for (const entry of value) {
    for (const related of (entry as Record<string, unknown>).related as string[]) {
      if (!slugs.has(related)) throw new Error(`Use case “${String((entry as Record<string, unknown>).slug)}” references missing related slug “${related}”.`)
    }
  }

  return value as UseCaseEntry[]
}

export const useCases = validateUseCases(rawUseCases)

export const categoryLabel = (category: UseCaseCategory) =>
  useCaseCategories.find((item) => item.id === category)?.label ?? category

export const statusLabel = (status: UseCaseStatus) => status[0].toUpperCase() + status.slice(1)
