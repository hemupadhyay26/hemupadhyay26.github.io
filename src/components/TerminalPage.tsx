import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { TerminalCommand } from '../types'
import { fadeIn } from '../lib/animations'

// Local UI-state type — NOT in src/types/index.ts (not shared data)
type TerminalEntry =
  | { type: 'command'; value: string }
  | { type: 'output'; lines: string[] }
  | { type: 'error'; message: string }

const PROMPT = 'hem@portfolio:~$'

const WELCOME: string[] = [
  "╔══════════════════════════════════════════════════════╗",
  "║         Welcome to Hem's Terminal Portfolio          ║",
  "╚══════════════════════════════════════════════════════╝",
  '',
  "Type 'help' to see all available commands.",
  '',
]

type TerminalPageProps = {
  commands: TerminalCommand[]
  onBack: () => void
}

export function TerminalPage({ commands, onBack }: TerminalPageProps) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<TerminalEntry[]>([
    { type: 'output', lines: WELCOME },
  ])
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdIndex, setCmdIndex] = useState(-1)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function execute(raw: string) {
    const trimmed = raw.trim()
    // Extract base command (first word) so "cat resume.pdf" matches "cat"
    const base = trimmed.toLowerCase().split(/\s+/)[0]
    const withCmd: TerminalEntry[] = [
      ...history,
      { type: 'command', value: trimmed },
    ]

    if (base === '') {
      setHistory(withCmd)
    } else if (base === 'clear') {
      setHistory([])
    } else if (base === 'help') {
      const lines = [
        'Available commands:',
        '',
        '  help          — show this help message',
        '  clear         — clear the terminal',
        ...commands.map((c) => `  ${c.command.padEnd(14)}— ${c.description}`),
        '',
      ]
      setHistory([...withCmd, { type: 'output', lines }])
    } else {
      const found = commands.find((c) => c.command === base)
      if (found) {
        const lines = Array.isArray(found.output) ? found.output : [found.output]
        setHistory([...withCmd, { type: 'output', lines: ['', ...lines, ''] }])
      } else {
        setHistory([
          ...withCmd,
          {
            type: 'error',
            message: `Command not found: ${base}. Type 'help' for a list of commands.`,
          },
        ])
      }
    }

    if (base) setCmdHistory((prev) => [trimmed, ...prev])
    setCmdIndex(-1)
    setInput('')
  }

  function autocomplete() {
    const partial = input.trim().toLowerCase().split(/\s+/)[0]
    if (!partial) return

    const all = ['help', 'clear', ...commands.map((c) => c.command)]
    const matches = all.filter((c) => c.startsWith(partial))

    if (matches.length === 1) {
      // Exact single match — complete it
      setInput(matches[0])
    } else if (matches.length > 1) {
      // Multiple matches — show them as output (bash-style)
      setHistory((prev) => [
        ...prev,
        { type: 'command', value: input.trim() },
        { type: 'output', lines: [matches.join('  '), ''] },
      ])
    }
    // 0 matches — do nothing
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      execute(input)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      autocomplete()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cmdIndex + 1, cmdHistory.length - 1)
      setCmdIndex(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(cmdIndex - 1, -1)
      setCmdIndex(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    }
  }

  return (
    <motion.section
      className="mx-auto max-w-5xl px-6 py-12"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {/* Terminal window */}
      <div
        className="rounded-xl border border-[var(--border-light)] bg-[var(--terminal-bg)] overflow-hidden shadow-2xl cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-[var(--border-light)] bg-[var(--surface)] px-4 py-3 select-none">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-[var(--text-muted)] font-mono">
            hem@portfolio — bash
          </span>
        </div>

        {/* Output area */}
        <div className="h-[62vh] overflow-y-auto p-5 font-mono text-sm leading-relaxed">
          {history.map((entry, i) => {
            if (entry.type === 'command') {
              return (
                <div key={i} className="flex gap-2">
                  <span className="text-[var(--terminal-prompt)] select-none shrink-0">
                    {PROMPT}
                  </span>
                  <span className="text-[var(--text-light)]">{entry.value}</span>
                </div>
              )
            }
            if (entry.type === 'error') {
              return (
                <p key={i} className="text-red-400 mt-1 mb-2 pl-1">
                  {entry.message}
                </p>
              )
            }
            // type === 'output'
            return (
              <div key={i} className="text-[var(--text-muted)] whitespace-pre">
                {entry.lines.map((line, j) => (
                  <div key={j}>{line || '\u00A0'}</div>
                ))}
              </div>
            )
          })}

          {/* Active input row */}
          <div className="flex gap-2 items-center mt-1">
            <span className="text-[var(--terminal-prompt)] select-none shrink-0">
              {PROMPT}
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-[var(--text-light)] outline-none caret-[var(--terminal-prompt)]"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              aria-label="Terminal input"
            />
          </div>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Hint bar */}
      <p className="mt-4 text-center text-xs text-[var(--text-muted)] font-mono">
        <kbd className="rounded border border-[var(--border-light)] px-1 py-0.5">Tab</kbd>{' '}
        autocomplete &nbsp;·&nbsp;{' '}
        <kbd className="rounded border border-[var(--border-light)] px-1 py-0.5">↑</kbd>{' '}
        <kbd className="rounded border border-[var(--border-light)] px-1 py-0.5">↓</kbd>{' '}
        history &nbsp;·&nbsp;{' '}
        <button onClick={onBack} className="text-[var(--accent)] hover:underline cursor-pointer">
          ← back to portfolio
        </button>
      </p>
    </motion.section>
  )
}
