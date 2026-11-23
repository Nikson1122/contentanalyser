/**
 * Selectable options for the page form.
 * These are generic platform/language choices — never user-specific data.
 * Niche/category is free text so any niche can be created later.
 */
export const PLATFORMS = [
  'Instagram',
  'YouTube',
  'TikTok',
  'Facebook',
  'X (Twitter)',
  'LinkedIn',
  'Pinterest',
  'Threads',
  'Other',
]

export const LANGUAGES = [
  'English',
  'Hindi',
  'Spanish',
  'Portuguese',
  'French',
  'German',
  'Arabic',
  'Indonesian',
  'Japanese',
  'Other',
]

export const EMPTY_PAGE_FORM = {
  name: '',
  platform: '',
  niche: '',
  description: '',
  language: '',
}
