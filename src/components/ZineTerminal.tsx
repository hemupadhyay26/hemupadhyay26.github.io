import { useEffect, useRef, useState } from 'react'
import { emailAddress } from '../data'

type TermLine = { type: 'cmd' | 'out'; text: string }

const INIT_LINES: TermLine[] = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'Hem Upadhyay · DevOps & AI Engineer · 2+ yrs' },
  { type: 'cmd', text: 'ls projects/' },
  { type: 'out', text: 'infuse-ai/  interview-ai/  ssh-cred-manager/  slack-notifs/  tantrumpy/' },
]

function runCmd(cmd: string, email: string): TermLine[] {
  const c = cmd.trim()
  const echo: TermLine = { type: 'cmd', text: cmd }
  if (c === '') return [echo]
  if (c === 'clear') return []
  const outs: string[] = []
  if (c === 'whoami') {
    outs.push('Hem Upadhyay · DevOps & AI Engineer · Hyderabad, IN')
  } else if (c === 'ls' || c.startsWith('ls projects')) {
    outs.push('infuse-ai/  interview-ai/  ssh-cred-manager/  slack-notifs/  tantrumpy/')
  } else if (c === 'cat about.md') {
    outs.push('# Hem Upadhyay', 'DevOps Engineer · AI Practitioner · Hyderabad, IN', '',
      '2+ years building scalable AWS infra, CI/CD, and lately', 'agentic workflows with LangGraph & Pydantic.',
      '', `Email: ${email}`)
  } else if (c === 'skills') {
    outs.push('infra  · terraform, aws, docker, gh-actions', 'code   · python, fastapi, pydantic',
      'ai     · langgraph, rag, agents, bedrock', 'ops    · cloudwatch, ses, iam, cloudtrail')
  } else if (c === 'contact') {
    outs.push(`email    · ${email}`, 'linkedin · /in/hem-upadhyay-4460b31b9',
      'github   · @hemupadhyay26', 'dev.to   · hem_upadhyay_ad9428dc9ddc')
  } else if (c === 'help') {
    outs.push('Available commands:', '  whoami        — who is this', '  ls projects/  — list projects',
      '  cat about.md  — short bio', '  skills        — the stack',
      '  contact       — how to reach me', '  clear         — clear the screen', '  help          — this message')
  } else {
    outs.push(`zsh: command not found: ${c} — try \`help\``)
  }
  return [echo, ...outs.map(t => ({ type: 'out' as const, text: t }))]
}

export function ZineTerminal() {
  const [lines, setLines] = useState<TermLine[]>(INIT_LINES)
  const [buffer, setBuffer] = useState('')
  const [focused, setFocused] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  useEffect(() => {
    if (!focused) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const result = runCmd(buffer, emailAddress)
        if (buffer.trim() === 'clear') { setLines([]); setBuffer(''); return }
        setLines(prev => [...prev, ...result])
        setBuffer('')
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        setBuffer(b => b.slice(0, -1))
      } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setBuffer(b => b + e.key)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [focused, buffer])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const inside = (e.target as Element).closest('.term')
      setFocused(!!inside)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

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
            — {focused ? 'type a command' : 'click to focus, then type a command or `help`'} —
          </span>
          <span className="term-line">
            <span className="term-p">hem@portfolio</span>{' '}
            <span className="term-k">~</span> ${' '}
            <span className="term-c">{buffer}</span>
            <span className="term-caret" />
          </span>
        </div>
      </div>
    </section>
  )
}
