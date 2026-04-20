import { myWork } from '../data'

const CARD_CONFIG = [
  { spanClass: 'c-a', kind: 'AI · RAG',      status: "Shipped '25", featured: true },
  { spanClass: 'c-b', kind: 'AI · TOOLS',    status: "Shipped '25", featured: false },
  { spanClass: 'c-c', kind: 'DEVOPS · CLI',  status: "Shipped '24", featured: false },
  { spanClass: 'c-d', kind: 'CI/CD · OPS',   status: "Shipped '24", featured: false },
  { spanClass: 'c-e', kind: 'PYTHON · OSS',  status: "Shipped '24", featured: false },
]

function CardTitle({ title }: { title: string }) {
  const words = title.trim().split(' ')
  if (words.length <= 1) return <h3>{title}</h3>
  const last = words.pop()!
  return <h3>{words.join(' ')} <em>{last}</em></h3>
}

export function ZineWorks() {
  return (
    <section className="works3" id="work">
      <div className="wh">
        <h2>Selected <em>work.</em></h2>
        <div className="meta">0{myWork.length} entries · 2024 — 2026</div>
      </div>
      <div className="works3-grid">
        {myWork.slice(0, 5).map((project, i) => {
          const cfg = CARD_CONFIG[i]
          return (
            <a
              key={project.title}
              className={`card ${cfg.spanClass}`}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="card-head">
                <div className="n">
                  {String(i + 1).padStart(3, '0')}{cfg.featured ? ' / featured' : ''}
                </div>
                <div className="k">{cfg.kind}</div>
              </div>
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="card-img"
                  loading="lazy"
                />
              )}
              <CardTitle title={project.title} />
              <p>{project.description}</p>
              <div className="card-foot">
                <div className="st">{cfg.status}</div>
                <div className="go">View →</div>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
