import { useState } from 'react'
import { Check } from 'lucide-react'
import { emailAddress } from '../data'
import type { SocialLink } from '../types'

type SocialIconProps = {
  link: SocialLink
  size?: number
}

export function SocialIcon({ link, size = 18 }: SocialIconProps) {
  const [copied, setCopied] = useState(false)
  const { Icon, label, href, copyEmail } = link

  const baseClass =
    'relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-light)] text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_12px_var(--accent-soft)]'

  if (copyEmail) {
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(emailAddress)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // clipboard unavailable
      }
    }
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={label}
        title={copied ? 'Copied!' : label}
        className={baseClass}
      >
        {copied ? <Check size={size} /> : <Icon size={size} />}
      </button>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={baseClass}
    >
      <Icon size={size} />
    </a>
  )
}
