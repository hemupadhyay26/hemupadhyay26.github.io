import { experienceCards, education, emailAddress, socialLinks, resumeFile } from '../data'

const ABOUT_TAGS = ['DevOps', 'AI eng', 'Python', 'Terraform', 'AWS', 'LangGraph', 'Pydantic', 'Docker', 'CI/CD']

const STACK = [
  { name: '— Cloud',         items: ['AWS', 'EC2 / ECS', 'RDS', 'S3', 'IAM', 'ES', 'CloudWatch', 'ECR'] },
  { name: '— Infra as Code', items: ['Terraform', 'Docker', 'GitHub Actions', 'Bitbucket', 'Gitea', 'CI/CD'] },
  { name: '— Code',          items: ['Python', 'FastAPI', 'Pydantic', 'SQL', 'Bash'] },
  { name: '— AI',            items: ['LangGraph', 'RAG', 'Agents', 'Bedrock', 'Pydantic AI'] },
]

const NOW_ITEMS = [
  { tag: 'Build', d: 'Cloud infra & security automation at Strobes',      t: 'In progress' },
  { tag: 'Read',  d: 'Designing Data-Intensive Applications',              t: 'This month' },
  { tag: 'Build', d: 'Multi-agent ops tooling with LangGraph',             t: 'Side project' },
  { tag: 'Ship',  d: 'IAM boundary & cloud security improvements',         t: "Done · Q1 '26" },
  { tag: 'Write', d: 'DevOps + AI engineering notes on Dev.to',            t: 'Ongoing' },
]

export function ZineMarquee() {
  const items = ['DevOps', 'AWS', 'Terraform', 'Python', 'LangGraph', 'Pydantic', 'RAG', 'CI/CD', 'Agents']
  const text = items.map(i => `${i} <span>◇</span>`).join(' ')
  return (
    <div className="marq3" aria-hidden="true">
      <div className="marquee">
        {[0, 1].map(k => (
          <div key={k} className="m" dangerouslySetInnerHTML={{ __html: text }} />
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
        <h2>Builds quiet <em>machinery</em> for loud systems.</h2>
        <div className="tags">
          {ABOUT_TAGS.map(tag => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="right">
        <p>
          Two years in production — shipping CI/CD pipelines that behave, Terraform modules
          that outlive their authors, and Python tools that quietly retire weekly meetings.
        </p>
        <p>
          The AI work came naturally: <em>RAG systems, LangGraph agents, Pydantic workflows</em>.
          It's the same instinct — find the repetitive, the fragile, the half-thought-through,
          and replace it with something that reads well and stays up.
        </p>
        <p>Based in Hyderabad. Currently at Strobes. Taking briefs — say hi.</p>
      </div>
    </section>
  )
}

export function ZineNow() {
  return (
    <section className="now3" id="now">
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
    </section>
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
      <div className="meta" style={{ marginBottom: '24px' }}>§ 04 / A short résumé</div>
      <h2>Where I've <em>been.</em></h2>
      <div>
        {experienceCards.map(exp => (
          <div key={`${exp.company}-${exp.period}`} className="row reveal">
            <div className="when">{exp.period}</div>
            <div className="role">{exp.role}<em>{exp.company}</em></div>
            <div className="desc">
              {exp.bullets.length > 0
                ? exp.bullets.join(' ')
                : `${exp.role} at ${exp.company}.`}
            </div>
            <div className="loc">{exp.location}</div>
          </div>
        ))}
        {education.map(edu => (
          <div key={edu.title} className="row reveal">
            <div className="when">{edu.period}</div>
            <div className="role">
              B.Tech, CS&E<em>{edu.institution.split(',')[0]}</em>
            </div>
            <div className="desc">
              Independent projects in cloud, automation, and AI tooling.
            </div>
            <div className="loc">Uttarakhand, IN</div>
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
        <div>© MMXXVI · Hem Upadhyay</div>
        <div>Set in Newsreader & Geist</div>
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          ↑ Back to top
        </a>
      </div>
    </>
  )
}
