import { useEffect, useRef, useState } from 'react'
import { emailAddress } from '../data'
import { resumeFile } from '../data'

type TermLine = {
  type: 'cmd' | 'out'
  text: string | React.ReactNode
}
/* ---------------- COMMANDS ---------------- */

const COMMANDS = [
  {
    command: 'whoami',
    description: 'who is this',
    output: ['Hem Upadhyay · DevOps Engineer · Hyderabad, IN'],
  },
  {
    command: "pwd",
    description: 'where am i',
    output: ['/home/ubuntu/hemupadhyay'],
  },{
  command: 'resume',
  description: 'view resume',
  output: [
    <a
      href={resumeFile}
      target="_blank"
      rel="noopener noreferrer"
      className="term-link"
    >
      Visit here for resume
    </a>
  ],
},
  {
    command: 'projects',
    description: 'list projects',
    output: ['infuse-ai/  ssh-cred-manager/  slack-notifs/  tantrumpy/'],
  },
  {
    command: 'skills',
    description: 'tech stack',
    output: [
      'infra  · terraform, aws, docker',
      'ci/cd  · github actions, pipelines',
      'code   · python, fastapi, bash',
      'ops    · cloudwatch, grafana, prometheus',
    ],
  },
  {
    command: 'contact',
    description: 'how to reach me',
    output: [
      `email    · ${emailAddress}`,
      'github   · @hemupadhyay26',
      'linkedin · /in/hem-upadhyay',
    ],
  },
]

/* ---------------- INIT ---------------- */

const INIT_LINES: TermLine[] = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'Hem Upadhyay · DevOps Engineer · 2+ yrs' },
]

/* ---------------- COMMAND ENGINE ---------------- */

function runCmd(cmd: string): TermLine[] {
  const c = cmd.trim()
  const base = c.toLowerCase().split(/\s+/)[0]

  const echo: TermLine = { type: 'cmd', text: cmd }

  if (!base) return [echo]

  if (base === 'clear') return []

  if (base === 'help') {
    return [
      echo,
      { type: 'out', text: 'Available commands:' },
      ...COMMANDS.map(c => ({
        type: 'out' as const,
        text: `${c.command} — ${c.description}`,
      })),
      { type: 'out', text: 'clear — clear terminal' },
    ]
  }

  const found = COMMANDS.find(c => c.command === base)

  if (found) {
    return [
      echo,
      ...found.output.map(line => ({
        type: 'out' as const,
        text: line,
      })),
    ]
  }

  return [
    echo,
    { type: 'out', text: `command not found: ${base}` },
  ]
}

/* ---------------- COMPONENT ---------------- */

export function ZineTerminal() {
  const [lines, setLines] = useState<TermLine[]>(INIT_LINES)
  const [buffer, setBuffer] = useState('')
  const [focused, setFocused] = useState(false)

  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdIndex, setCmdIndex] = useState(-1)

  const bodyRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  /* scroll */
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  /* focus */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const inside = (e.target as Element).closest('.term')
      setFocused(!!inside)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  /* keyboard handler */
  useEffect(() => {
    if (!focused) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()

        const result = runCmd(buffer)

        if (buffer.trim() === 'clear') {
          setLines([])
          setBuffer('')
          return
        }

        setLines(prev => [...prev, ...result])

        if (buffer.trim()) {
          setCmdHistory(prev => [buffer, ...prev])
        }

        setCmdIndex(-1)
        setBuffer('')
      }

      else if (e.key === 'Backspace') {
        e.preventDefault()
        setBuffer(b => b.slice(0, -1))
      }

      else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.min(cmdIndex + 1, cmdHistory.length - 1)
        setCmdIndex(next)
        setBuffer(cmdHistory[next] ?? '')
      }

      else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.max(cmdIndex - 1, -1)
        setCmdIndex(next)
        setBuffer(next === -1 ? '' : cmdHistory[next])
      }

      else if (e.key === 'Tab') {
        e.preventDefault()

        const partial = buffer.toLowerCase()
        const all = ['help', 'clear', ...COMMANDS.map(c => c.command)]
        const matches = all.filter(c => c.startsWith(partial))

        if (matches.length === 1) {
          setBuffer(matches[0])
        } else if (matches.length > 1) {
          setLines(prev => [
            ...prev,
            { type: 'out', text: matches.join('  ') },
          ])
        }
      }

      else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setBuffer(b => b + e.key)
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [focused, buffer, cmdHistory, cmdIndex])

  /* mobile submit */
  function submitMobile(val: string) {
    const result = runCmd(val)

    if (val.trim() === 'clear') {
      setLines([])
      setBuffer('')
      return
    }

    setLines(prev => [...prev, ...result])

    if (val.trim()) {
      setCmdHistory(prev => [val, ...prev])
    }

    setCmdIndex(-1)
    setBuffer('')
    if (mobileInputRef.current) mobileInputRef.current.value = ''
  }

  return (
    <section className="term-sec" id="terminal">
      <div className="term-head">
        <h2>Talk to the <em>shell.</em></h2>
        <div className="meta">try `help`</div>
      </div>

      <div className="term" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="bar">
          <span className="d" /><span className="d" /><span className="d" />
          <span className="ti">hem@portfolio ~ — zsh</span>
        </div>

        <div className="term-body" ref={bodyRef}>
          {lines.map((line, i) =>
            line.type === 'cmd' ? (
              <span key={i} className="term-line">
                <span className="term-p">hem@portfolio</span>{' '}
                <span className="term-k">~</span> ${' '}
                <span className="term-c">{line.text}</span>
              </span>
            ) : (
              <span key={i} className="term-line">{line.text || '\u00a0'}</span>
            )
          )}

          <span className="term-line term-muted">
            — {focused ? 'type a command' : 'click to focus, then type `help`'} —
          </span>

          <span className="term-line">
            <span className="term-p">hem@portfolio</span>{' '}
            <span className="term-k">~</span> ${' '}
            <span className="term-c">{buffer}</span>
            <span className="term-caret" />
          </span>
        </div>

        {/* Mobile */}
        <div className="term-mobile-input">
          <span className="term-p">hem@portfolio</span>
          <span className="term-k">~</span>
          <span>$</span>
          <input
            ref={mobileInputRef}
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="type a command…"
            onChange={e => setBuffer(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submitMobile(buffer)
              }
            }}
          />
          <button onClick={() => submitMobile(buffer)}>↵</button>
        </div>
      </div>
    </section>
  )
}