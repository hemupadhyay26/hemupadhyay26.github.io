import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Linkedin,
  MapPin,
  Menu,
  PauseCircle,
  PlayCircle,
  X,
} from 'lucide-react'
import AudioDock from './components/AudioDock'
import heroPortrait from './assets/hero.webp'
import resumeFile from './assets/hem_upadhyay_resume.pdf'
import infuseAi from './assets/infuseAI.png'
import interviewAI from './assets/interviewAI.png'
import sshCredManger from './assets/sshCredManger.png'
import slackNotificationTemplate from './assets/slack-notification-template.png'
import './App.css'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'My Work', href: '#work' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hem-upadhyay-4460b31b9/', external: true },
  { label: 'Preview Resume', href: resumeFile, external: true },
]

const aboutText = `DevOps Engineer with 2+ years of experience building scalable AWS infrastructure, automating CI/CD pipelines, and improving reliability across production systems. Skilled in Terraform, Docker, GitHub Actions, Bitbucket, Gitea, and core AWS services including EC2, RDS, ECS, ECR, S3, IAM, SES, and CloudWatch. I focus on automation, uptime, secure deployments, and high-performance systems.

Alongside DevOps, I also work extensively with Python, creating automation scripts and internal tooling to streamline operations. I have hands-on experience in AI engineering, including building RAG models, developing AI agents using LangGraph, and applying Pydantic for robust data workflows. This blend of DevOps and AI enables me to design intelligent, automated solutions that improve efficiency and reduce operational complexity.`

const emailAddress = 'hemupadhyay234@gmail.com'

const myWork = [
  {
    title: 'Infuse AI',
    description: 'A RAG based AI agent that help you get answers based on your documents.',
    cover: 'infuse ai',
    image: infuseAi,
  },
  {
    title: 'Interview AI',
    description: 'A AI agent that helps you prepare for your interviews based on the job description.',
    cover: 'interview ai',
    image: interviewAI,
  },
  {
    title: 'SSH Credential Manager',
    description: 'A tool that helps you manage your SSH credentials.',
    cover: 'ssh credential manager',
    image: sshCredManger,
  },
  {
    title: 'Slack Notification Template',
    description: 'A template for creating and sending notifications to Slack channels, enhancing team communication during CI/CD processes.',
    cover: 'slack notification template',
    image: slackNotificationTemplate,
  },
]

const experienceCards = [
  {
    location: 'Remote, Hyderabad',
    company: 'Strobes',
    role: 'Cloud Engineer',
    period: 'Nov 2025 – PRESENT',
    bullets: [
    ],
  },
  {
    location: 'Uttarakhand, India',
    company: 'Rubico IT',
    role: 'Devops Engineer',
    period: 'Mar 2024 – Oct 2025',
    bullets: [
      'Fully automated CI/CD pipelines for deploy on dev/stage/prod environments.',
      'Monitoring and alerting for the production systems(cloudwatch, grafana, etc.).',
    ],
  },
]

// const certifications = [
//   {
//     title: 'User Research - Methods and Best Practices',
//     issuer: 'The Interaction Design Foundation',
//     link: '#',
//   },
//   {
//     title: 'Human-Computer Interaction - HCI',
//     issuer: 'The Interaction Design Foundation',
//     link: '#',
//   },
//   {
//     title: 'Accessibility: How to Design for All (Ongoing)',
//     issuer: 'The Interaction Design Foundation',
//     link: '#',
//   },
//   {
//     title: 'Dynamic User Experience: Design and Usability (Ongoing)',
//     issuer: 'The Interaction Design Foundation',
//     link: '#',
//   },
// ]

const education = [
  {
    title: "Bachelor's of Technology in Computer Science and Engineering",
    period: '2020 – 2024',
    institution: 'Graphic Era University, Bhimtal, Uttarakhand',
  },
]

const floatingTags = [
  { label: 'DevOps', top: '8%', left: '10%', delay: '0s', duration: '8.4s' },
  { label: 'GIT', top: '8%', left: '80%', delay: '0.3s', duration: '7.2s' },
  { label: 'GITHUB CI/CD', top: '5%', left: '60%', delay: '0.3s', duration: '7.2s' },
  { label: 'Gitops', top: '28%', left: '15%', delay: '0.8s', duration: '6.7s' },
  { label: 'AWS', top: '25%', left: '75%', delay: '1.1s', duration: '7.9s' },

  { label: 'ECS', top: '58%', left: '10%', delay: '0.6s', duration: '6.4s' },
  { label: 'AI Agents', top: '48%', left: '72%', delay: '1.0s', duration: '8.6s' },
  { label: 'Terraform', top: '18%', left: '43%', delay: '0.2s', duration: '9.3s' },
  { label: 'Python', top: '40%', left: '33%', delay: '0.5s', duration: '7.6s' },

  { label: 'Scripting', top: '68%', left: '28%', delay: '1.3s', duration: '6.2s' },
  { label: 'RDS', top: '70%', left: '63%', delay: '0.4s', duration: '8.1s' },
  { label: 'Grafana', top: '35%', left: '53%', delay: '1.4s', duration: '7.0s' },
  { label: 'Docker', top: '18%', left: '82%', delay: '0.3s', duration: '6.9s' },

  { label: 'CI/CD', top: '55%', left: '48%', delay: '0.8s', duration: '7.3s' },
  { label: 'Kubernetes', top: '82%', left: '18%', delay: '1.1s', duration: '9.0s' },
  { label: 'Linux', top: '84%', left: '73%', delay: '0.9s', duration: '6.5s' },
  { label: 'Monitoring', top: '38%', left: '23%', delay: '1.5s', duration: '8.5s' },

  { label: 'GITHUB', top: '62%', left: '42%', delay: '1s', duration: '6.6s' },
  { label: 'LangGraph', top: '52%', left: '78%', delay: '1.3s', duration: '8.8s' },
  { label: 'Pydantic', top: '72%', left: '52%', delay: '0.2s', duration: '7.1s' },

  { label: 'AI Automation', top: '20%', left: '58%', delay: '0.6s', duration: '9.2s' },
  { label: 'ECR', top: '46%', left: '12%', delay: '1s', duration: '6.8s' },
  { label: 'SES', top: '32%', left: '42%', delay: '0.7s', duration: '8.0s' },
  { label: 'CloudWatch', top: '65%', left: '72%', delay: '1.3s', duration: '7.7s' },

  { label: 'S3', top: '14%', left: '23%', delay: '0.3s', duration: '8.3s' },
  { label: 'IAM', top: '76%', left: '33%', delay: '0.9s', duration: '6.7s' },
  { label: 'Automation', top: '44%', left: '47%', delay: '1.2s', duration: '9.4s' },
  { label: 'Containerization', top: '33%', left: '69%', delay: '1.4s', duration: '8.7s' },
  { label: 'Infrastructure as Code', top: '86%', left: '47%', delay: '0.7s', duration: '6.4s' }
];

type AudioCommand = {
  id: number
  action: 'play' | 'pause'
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAudioDockVisible, setIsAudioDockVisible] = useState(false)
  const [audioCommand, setAudioCommand] = useState<AudioCommand | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [copiedSource, setCopiedSource] = useState<'hero' | 'footer' | null>(null)

  const handleEmailCopy = async (source: 'hero' | 'footer') => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopiedSource(source)
      setTimeout(() => setCopiedSource(null), 2000)
    } catch (error) {
      console.error('Copy failed', error)
    }
  }

  const toggleAudioDockVisibility = () =>
    setIsAudioDockVisible((prev) => {
      const nextVisible = !prev
      setAudioCommand({
        id: Date.now(),
        action: nextVisible ? 'play' : 'pause',
      })
      return nextVisible
    })

  const handleAudioPlayingChange = (playing: boolean) => setIsAudioPlaying(playing)

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-light)]">
      <header className="border-b border-[var(--border-light)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-5">
          <span className="text-lg font-semibold cursor-pointer">Hem Upadhyay</span>
          <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-[var(--text-muted)] md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="transition hover:text-[var(--text-light)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAudioDockVisibility}
              className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition md:inline-flex ${isAudioPlaying
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-[var(--border-light)] text-[var(--text-light)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              aria-pressed={isAudioDockVisible}
              title="Play song"
            >
              {isAudioPlaying ? (
                <PauseCircle className="h-4 w-4" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
              {isAudioPlaying ? 'Pause song' : 'Play song'}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-light)] p-2 text-[var(--text-light)] transition hover:border-[var(--text-light)] md:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-b border-[var(--border-light)] bg-[var(--surface)] px-6 py-4 lg:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="rounded-md px-2 py-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--text-light)]"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl space-y-16 px-6 py-12">
        <section
          id="home"
          className="rounded-3xl border border-[var(--border-light)] bg-[var(--surface)] p-8 sm:p-10"
        >
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-[var(--surface-elevated)] p-6 text-center sm:w-64">
              <div className="h-32 w-32 overflow-hidden rounded-2xl border border-[var(--border-light)] shadow-[0_20px_45px_rgba(2,6,23,0.65)]">
                <img
                  src={heroPortrait}
                  alt="Hem Upadhyay portrait"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Hem Upadhyay</h1>
                <p className="text-sm text-[var(--text-muted)]">Devops Engineer | AI enthusiasts</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Uttarakhand, India</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(59,201,109,0.12)] px-3 py-1 text-xs font-semibold text-[var(--text-light)]">
                <Check className="h-3 w-3 text-[rgb(59,201,109)]" />
                Available for work
              </span>
              <a
                href={resumeFile}
                download
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-light)] transition hover:text-[var(--accent)]"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-4 border-b border-[var(--border-light)] pb-4 text-sm">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => handleEmailCopy('hero')}
                    className="inline-flex items-center gap-2 text-[var(--text-light)] transition hover:text-[var(--accent)]"
                  >
                    <Copy className="h-4 w-4" />
                    {emailAddress}
                  </button>
                  <span
                    className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-semibold text-[var(--bg-dark)] shadow-[0_12px_30px_rgba(76,194,255,0.3)] transition-all duration-200 ${copiedSource === 'hero' ? 'opacity-100 -translate-y-1' : 'pointer-events-none opacity-0'
                      }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Copied!
                    </span>
                  </span>
                </div>
                <span className="text-[var(--text-muted)]">|</span>
                <a
                  href="https://www.linkedin.com/in/hem-upadhyay-4460b31b9/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--text-muted)] transition hover:text-[var(--text-light)]"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[var(--text-light)]">About me</h2>
                <p className="text-sm text-[var(--text-muted)] whitespace-pre-line">{aboutText}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--text-light)]">
              Some of my work
            </h3>
            <a
              href="https://github.com/hemupadhyay26"
              target="_blank"
              className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-light)]"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {myWork.map((study) => (
              <article
                key={study.title}
                className="space-y-3 rounded-2xl border border-[var(--border-light)] bg-[var(--surface)] p-4"
              >
                <div className="h-40 w-full overflow-hidden rounded-xl">
                  <img
                    className="h-full w-full object-cover"
                    src={study.image}
                    alt={study.title}
                  />
                </div>

                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  {study.cover}
                </p>

                <h4 className="text-lg font-semibold text-[var(--text-light)]">
                  {study.title}
                </h4>

                <p className="text-sm text-[var(--text-muted)]">
                  {study.description}
                </p>
              </article>
            ))}
          </div>

        </section>

        <section id="experience" className="space-y-8">
          <h3 className="text-lg font-semibold text-[var(--text-light)]">Experience</h3>
          <div className="space-y-6">
            {experienceCards.map((exp) => (
              <article
                key={`${exp.company}-${exp.period}`}
                className="rounded-2xl border-l-2 border-[var(--border-light)] bg-transparent p-6"
              >
                <div className="flex flex-col gap-2 pb-4 text-sm text-[var(--text-muted)] md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="flex items-center gap-1 text-xs uppercase tracking-[0.3em]">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[var(--text-light)]">{exp.company}</p>
                    <p className="text-sm">{exp.role}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                    {exp.period}
                  </p>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-[var(--text-muted)]">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* <section className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--text-light)]">Certifications</h3>
            <p className="text-sm text-[var(--text-muted)]">Recent upskilling highlights</p>
          </div>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <article
                key={cert.title}
                className="flex flex-col gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-[var(--text-light)]">{cert.title}</p>
                  <p>{cert.issuer}</p>
                </div>
                <a
                  href={cert.link}
                  className="inline-flex items-center gap-2 text-[var(--text-light)] transition hover:text-[var(--accent)]"
                >
                  View
                  <ExternalLink className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </section> */}

        <section className="space-y-8">
          <h3 className="text-lg font-semibold text-[var(--text-light)]">Education</h3>
          <div className="space-y-4">
            {education.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border-l-2 border-[var(--border-light)] bg-transparent p-4 text-sm text-[var(--text-muted)]"
              >
                <p className="text-base font-semibold text-[var(--text-light)]">{item.title}</p>
                <p className="text-xs uppercase tracking-[0.3em]">{item.period}</p>
                <p className="mt-1">{item.institution}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-light)]">Skills & Tools</h3>
          </div>

          <div className="skill-cloud relative h-[360px] overflow-hidden rounded-3xl">
            {floatingTags.map((tag) => (
              <span
                key={tag.label}
                className="floating-chip absolute inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--text-light)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                style={{
                  top: tag.top,
                  left: tag.left,
                  animationDelay: tag.delay,
                  animationDuration: tag.duration,
                  cursor: 'pointer',
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {tag.label}
              </span>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-[var(--border-light)] bg-[var(--surface)]/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-[var(--text-light)]">© Hem Upadhyay</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
            <button
              type="button"
              onClick={() => handleEmailCopy('footer')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition ${copiedSource === 'footer'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-[var(--border-light)] text-[var(--text-light)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
            >
              {copiedSource === 'footer' ? (
                <>
                  <Check className="h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> {emailAddress}
                </>
              )}
            </button>
            <a
              href="https://www.linkedin.com/in/hem-upadhyay-4460b31b9/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] px-4 py-2 text-[var(--text-light)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
      <AudioDock
        isVisible={isAudioDockVisible}
        command={audioCommand}
        onPlayingChange={handleAudioPlayingChange}
      />
    </div>
  )
}

export default App
