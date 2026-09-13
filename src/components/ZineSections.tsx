import { useEffect, useRef } from 'react'
import { experienceCards, education, emailAddress, socialLinks, resumeFile } from '../data'
import { AnimateIcon } from './animate-ui/icons/icon'
import { ArrowUp } from './animate-ui/icons/arrow-up'
import { ZineGlobe } from './ZineGlobe'
import Scanner from './reactbits/Scanner'
const ABOUT_TAGS = ['DevOps', 'AWS', 'ECS / EC2', 'Terraform', 'Terragrunt', 'CI/CD', 'Cost Optimization', 'Monitoring']

// How long (seconds) the marquee takes to cross one loop-width at rest — matches the pace of
// the CSS animation this replaced.
const MARQUEE_LOOP_SECONDS = 40
// A drag's px/sec velocity is added straight on top of the resting speed, capped here so a wild
// flick doesn't send the text flying off-screen.
const MARQUEE_MAX_BOOST = 1400
// Exponential decay rate (per second) applied to that boost once the drag ends, so it eases
// back to resting speed over roughly a second instead of snapping back.
const MARQUEE_BOOST_DECAY_RATE = 2.2

const STACK = [
  {
    name: '— Infrastructure',
    items: ['Terraform', 'Docker', 'Sentry', 'GitHub Actions', 'Elastic Search', 'Rabbitmq', 'Redis', 'Gitea', 'CI/CD']
  },
  {
    name: '— Monitoring & Ops',
    items: ['CloudWatch', 'Prometheus', 'Grafana', 'Cost Optimization', 'DevSecOps']
  },
  {
    name: '— Code',
    items: ['Python', 'Bash']
  },
  {
    name: '— Cloud',
    items: ['AWS']
  },
]
// const NOW_ITEMS = [
//   { tag: 'Build', d: 'Devsecops cicd pipeline',t: 'In progress' },
// ]

export function ZineMarquee() {
  const items = [
    'DevOps',
    'AWS',
    'Terraform',
    'Docker',
    'Sentry',
    'CI/CD',
    'GitHub Actions',
    'SonarQube',
    'Python',
    'Scripting',
    'Cost Optimization',
    'Monitoring',
    'Automation',
  ]
  const text = items.map(i => `${i} <span>◇</span>`).join(' ')

  const trackRef = useRef<HTMLDivElement>(null)
  const firstItemRef = useRef<HTMLDivElement>(null)

  // Mutable drag/animation state that shouldn't trigger re-renders — the loop below drives the
  // DOM directly via a ref instead.
  const stateRef = useRef({
    offset: 0,
    loopWidth: 0,
    baseSpeed: 0,
    boost: 0,
    dragging: false,
    lastX: 0,
    lastT: 0,
  })

  useEffect(() => {
    const track = trackRef.current
    const firstItem = firstItemRef.current
    if (!track || !firstItem) return

    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap || '0')
      const loopWidth = firstItem.offsetWidth + gap
      stateRef.current.loopWidth = loopWidth
      stateRef.current.baseSpeed = loopWidth / MARQUEE_LOOP_SECONDS
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(firstItem)

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      // Skip while the preload overlay's backdrop-filter is active — see the matching note
      // in App.tsx's cursor loop for why anything moving underneath it is expensive.
      if (document.documentElement.classList.contains('preloading')) {
        raf = requestAnimationFrame(tick)
        return
      }

      const s = stateRef.current

      if (!s.dragging && s.boost > 0.5) {
        s.boost *= Math.exp(-MARQUEE_BOOST_DECAY_RATE * dt)
      } else if (!s.dragging) {
        s.boost = 0
      }

      s.offset -= (s.baseSpeed + s.boost) * dt
      if (s.loopWidth > 0 && s.offset <= -s.loopWidth) {
        s.offset += s.loopWidth
      }
      track.style.transform = `translateX(${s.offset}px)`

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = stateRef.current
    s.dragging = true
    s.lastX = e.clientX
    s.lastT = performance.now()
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = stateRef.current
    if (!s.dragging) return
    const now = performance.now()
    const dt = Math.max((now - s.lastT) / 1000, 1 / 120)
    const velocity = Math.abs(e.clientX - s.lastX) / dt
    s.lastX = e.clientX
    s.lastT = now
    s.boost = Math.min(velocity, MARQUEE_MAX_BOOST)
  }

  const endDrag = () => {
    stateRef.current.dragging = false
  }

  return (
    <div
      className="marq3"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="marquee" ref={trackRef}>
        {[0, 1].map(k => (
          <div
            key={k}
            className="m"
            ref={k === 0 ? firstItemRef : undefined}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ))}
      </div>
    </div>
  )
}

export function ZineAbout() {
  return (
    <section className="about3">
      <div className="left">
        <div className="meta" style={{ marginBottom: '24px' }}>§ 01 / The person</div>
        <h2>Engineers reliable <em>pipelines</em> for chaotic workloads.</h2>
        <div className="tags">
          {ABOUT_TAGS.map(tag => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="right">
        <p>
          Two years in production — hosting containerised services on <em>AWS ECS and EC2</em>,
          provisioning infrastructure with <em>Terraform</em>, and wiring GitHub Actions
          so deployments ship themselves instead of waiting on someone.
        </p>

        <p>
          The focus is on what comes after “it works” — <em>scaling services under load, trimming
            cloud spend, and keeping everything as infrastructure&nbsp;as&nbsp;code</em> so environments
          stay predictable, observable, and easy to maintain. Same instinct throughout: find what’s
          fragile, repetitive, or slow, and replace it with systems that hold up.
        </p>

      </div>
      <div className="about3-globe">
        <ZineGlobe />
      </div>
      <div className="about3-caption meta">
        <span className="dot pulse" />
        Based in Uttarakhand, India
      </div>
    </section>
  )
}

export function ZineNow() {
  return (
    <>
      {/* <section className="now3" id="now">
       <div className="lcol">
        <div className="meta" style={{ marginBottom: '24px' }}>§ 02 / On the desk</div>
        <h2>Right <em>now.</em></h2>
        <div className="sub">A log of things in flight · updated weekly</div>
      </div>
      <div className="rcol">
        {NOW_ITEMS.map((item, i) => (
          <div key={i} className="it">
            <span className="tag">{item.tag}</span>
            <span className="d">{item.d}</span>
            <span className="t">{item.t}</span>
          </div>
        ))}
      </div> 
     </section> */}
    </>
  )
}

export function ZineStack() {
  return (
    <section className="stack3">
      <div className="meta" style={{ marginBottom: '24px', color: 'var(--accent-2)' }}>§ 03 / Toolbox</div>
      <h2>The <em>stack.</em></h2>
      <div className="stack3-grid">
        {STACK.map(cat => (
          <div key={cat.name} className="cat">
            <h4>{cat.name}</h4>
            <ul>
              {cat.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
export function ZineExp() {
  return (
    <section className="exp3">
      <div className="meta" style={{ marginBottom: '24px' }}>
        § 04 / A short résumé
      </div>

      <h2>Where I've <em>been.</em></h2>

      <div>
        {experienceCards.map(exp => (
          <div key={`${exp.company}-${exp.period}`} className="row reveal">
            <div className="when">{exp.period}</div>

            <div className="role">
              {exp.role} <em>{exp.company}</em>
            </div>

            <div className="desc">
              {exp.bullets.length > 0 ? (
                <ul>
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : (
                `${exp.role} at ${exp.company}.`
              )}
            </div>

            <div className="loc">{exp.location}</div>
          </div>
        ))}

        {education.map(edu => (
          <div key={edu.title} className="row reveal">
            <div className="when">{edu.period}</div>

            <div className="role">
              B.Tech, CSE <em>{edu.institution}</em>
            </div>

            <div className="desc">
              {edu.description}
            </div>

            <div className="loc">{edu.loc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ZineContact() {
  const links: { label: string; href: string; external?: boolean }[] = [
    ...socialLinks
      .filter(l => l.id !== 'email')
      .map(l => ({ label: l.label, href: l.href, external: true })),
    { label: 'Résumé', href: resumeFile, external: true },
  ]

  return (
    <>
      <section className="cta3" id="contact">
        <div className="cta3-bg" aria-hidden="true">
          <Scanner
            color1="#f5efe8"
            color2="#1f0f0f"
            color3="#ff3c28"
            speed={0.4}
            sweepSpeed={0.2}
            scale={1.8}
            glow={0.18}
            opacity={0.45}
            grain={false}
            scanline={false}
          />
        </div>
        <div className="eyebrow">§ 05 · Correspondence</div>
        <h2>Say <em>hi.</em></h2>
        <a className="mail" href={`mailto:${emailAddress}`}>{emailAddress}</a>
        <div className="slinks">
          {links.map((link, i) => (
            <>
              {i > 0 && <span key={`sep-${i}`} className="sep">·</span>}
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </>
          ))}
        </div>
      </section>

      <div className="foot3">
        <div>© Hem Upadhyay</div>
        <AnimateIcon asChild animateOnHover>
          <a
            className="to-top"
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          >
            <ArrowUp size={13} /> Back to top
          </a>
        </AnimateIcon>
      </div>
    </>
  )
}
