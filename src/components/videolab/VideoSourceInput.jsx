import { ShieldCheck } from 'lucide-react'
import { Field, TextInput } from '../ui/Field'

/**
 * Public video URL input.
 *
 * The URL is recorded as a reference only — nothing is fetched, downloaded or
 * scraped from it. The notice below states the authorization requirement.
 */
export default function VideoSourceInput({ value, error, onChange }) {
  return (
    <div className="space-y-4">
      <Field
        label="Video URL"
        htmlFor="lab-video-url"
        error={error}
        hint="A direct, publicly accessible link to a video file or page you are authorized to use."
      >
        <TextInput
          id="lab-video-url"
          type="url"
          inputMode="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://…"
          error={error}
        />
      </Field>

      <div className="flex items-start gap-2.5 rounded-2xl border border-glow-400/25 bg-glow-500/[0.06] p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-glow-400" aria-hidden="true" />
        <div className="space-y-1.5 text-xs leading-relaxed text-slate-300">
          <p className="font-semibold text-glow-400">What can be analyzed</p>
          <p>
            Only video sources that are publicly accessible <em>and</em> that you own or are
            otherwise authorized to analyze. The URL is stored as a reference — this tool does not
            download, scrape or extract media from it.
          </p>
          <p className="text-slate-400">
            Links behind a login, paywall or a platform&apos;s terms that forbid automated access
            are not supported, and no social platform account is ever connected.
          </p>
        </div>
      </div>
    </div>
  )
}
