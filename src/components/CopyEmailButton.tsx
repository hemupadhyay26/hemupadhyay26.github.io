import { Copy, Check } from 'lucide-react'

type CopyEmailButtonProps = {
  source: 'hero' | 'footer'
  email: string
  copiedSource: 'hero' | 'footer' | null
  onCopy: (source: 'hero' | 'footer') => void
  className?: string
}

export function CopyEmailButton({ source, email, copiedSource, onCopy, className }: CopyEmailButtonProps) {
  const isCopied = copiedSource === source

  if (source === 'hero') {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => onCopy('hero')}
          className="inline-flex items-center gap-2 text-[var(--text-light)] transition hover:text-[var(--accent)]"
        >
          <Copy className="h-4 w-4" />
          {email}
        </button>
        <span
          className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-semibold text-[var(--bg-dark)] shadow-[0_12px_30px_rgba(76,194,255,0.3)] transition-[opacity,transform] duration-200 ease-out ${isCopied ? 'opacity-100 -translate-y-1' : 'pointer-events-none opacity-0'}`}
        >
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" />
            Copied!
          </span>
        </span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onCopy('footer')}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition ${isCopied ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border-light)] text-[var(--text-light)] hover:border-[var(--accent)] hover:text-[var(--accent)]'} ${className ?? ''}`}
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4" /> Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" /> {email}
        </>
      )}
    </button>
  )
}
