import { version as packageVersion } from '../../package.json'
import { LANGUAGES, PLATFORMS } from './pageOptions'

/**
 * Static option lists + default shape for the Settings module.
 * Nothing user-specific is hardcoded: every value below is a generic choice.
 * Language/platform lists are reused from pageOptions so the app has one source.
 */

export const APP_NAME = 'CreatorPulse AI'
export const APP_VERSION = packageVersion

export const SETTINGS_TABS = [
  { key: 'general', label: 'General' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'generation', label: 'Content Generation' },
  { key: 'workflow', label: 'Content Workflow' },
  { key: 'data', label: 'Data Management' },
  { key: 'about', label: 'About' },
]

/** Dashboard landing options mirror the sidebar routes a user can start on. */
export const LANDING_OPTIONS = [
  { value: '/', label: 'Overview' },
  { value: '/pages', label: 'My Pages' },
  { value: '/imports', label: 'CSV Imports' },
  { value: '/analytics', label: 'Analytics' },
  { value: '/competitors', label: 'Competitor Research' },
  { value: '/studio', label: 'AI Content Studio' },
  { value: '/video-lab', label: 'Video Learning Lab' },
  { value: '/calendar', label: 'Content Calendar' },
]

export const TIME_ZONES = [
  'UTC',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Australia/Sydney',
]

export const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark (default)' },
  { value: 'system', label: 'Match system' },
  { value: 'light', label: 'Light' },
]

export const TONE_OPTIONS = [
  'Professional',
  'Conversational',
  'Energetic',
  'Educational',
  'Storytelling',
  'Humorous',
  'Inspirational',
]

export const FORMAT_OPTIONS = [
  'Short video (Reel / Short)',
  'Long-form video',
  'Carousel',
  'Single image post',
  'Text post',
  'Live stream',
]

export const SCRIPT_LENGTH_OPTIONS = [
  { value: '15', label: '15 seconds' },
  { value: '30', label: '30 seconds' },
  { value: '60', label: '60 seconds' },
  { value: '90', label: '90 seconds' },
  { value: '180', label: '3 minutes' },
  { value: '600', label: '10 minutes' },
]

export const CAPTION_STYLE_OPTIONS = [
  'Short and punchy',
  'Descriptive',
  'Hook first',
  'Question led',
  'Listicle',
  'Minimal (no emoji)',
]

export const APPROVAL_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Needs review' },
  { value: 'approved', label: 'Approved' },
]

export const CATEGORY_OPTIONS = [
  'Educational',
  'Entertainment',
  'Promotional',
  'Behind the scenes',
  'Trending',
  'Community',
  'Uncategorised',
]

export { LANGUAGES, PLATFORMS }

/** Sensible, non-personal starting values. */
export const DEFAULT_SETTINGS = {
  // General
  displayName: '',
  language: 'English',
  timeZone: 'UTC',
  landingRoute: '/',
  // Appearance
  theme: 'dark',
  // Content generation
  contentLanguage: 'English',
  tone: 'Conversational',
  format: 'Short video (Reel / Short)',
  scriptLength: '30',
  captionStyle: 'Hook first',
  // Content workflow
  targetPlatform: 'Instagram',
  approvalStatus: 'draft',
  defaultCategory: 'Educational',
}
