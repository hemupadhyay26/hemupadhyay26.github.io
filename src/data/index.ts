import heroPortrait from '../assets/hero.webp'
import resumeFile from '../assets/hem_upadhyay_resume.pdf'
import projectInfuseAi from '../assets/projectInfuseAi.webp'
import projectInterviewAi from '../assets/projectInterviewAi.webp'
import projectSshCredManager from '../assets/projectSshCredManager.webp'
import projectSlackNotification from '../assets/projectSlackNotification.webp'
import projectTantrumpy from '../assets/projectTantrumpy.webp'
import audio1 from '../assets/audio/audio1.mp3'
import audio2 from '../assets/audio/audio2.mp3'
import audio3 from '../assets/audio/audio3.mp3'
import { Github, Linkedin, MessageSquare } from 'lucide-react'
import type { Project, Experience, Education, Track, SocialLink } from '../types'

export { heroPortrait, resumeFile }

export const isAvailableForWork: boolean = false

export const emailAddress = 'hemupadhyay234@gmail.com'

export const myWork: Project[] = [
  {
    title: 'Infuse AI',
    description: 'A RAG based AI agent that help you get answers based on your documents.',
    cover: 'infuse ai',
    image: projectInfuseAi,
    url: 'https://github.com/hemupadhyay26/infuse-ai',
  },
  {
    title: 'SSH Credential Manager',
    description: 'A tool that helps you manage your SSH credentials.',
    cover: 'ssh credential manager',
    image: projectSshCredManager,
    url: 'https://github.com/hemupadhyay26/ssh-cred-manager-python',
  },
  {
    title: 'Interview AI',
    description: 'A AI agent that helps you prepare for your interviews based on the job description.',
    cover: 'interview ai',
    image: projectInterviewAi,
    url: 'https://github.com/hemupadhyay26/interview-prep-helper/',
  },
  {
    title: 'Slack Notification Template',
    description: 'A template for creating and sending notifications to Slack channels, enhancing team communication during CI/CD processes.',
    cover: 'slack notification template',
    image: projectSlackNotification,
    url: 'https://github.com/hemupadhyay26/slack-github-action-template',
  },
  {
    title: 'Tantrumpy',
    description: 'A Python package that captures exit signals and prints a nice message when the program terminates.',
    cover: 'tantrumpy',
    image: projectTantrumpy,
    url: 'https://github.com/hemupadhyay26/tantrumpy',
  },
]

export const experienceCards: Experience[] = [
  {
    location: 'Remote, Hyderabad, India',
    company: 'Strobes',
    role: 'Cloud Engineer',
    period: 'Nov 2025 – Present',
    bullets: [
      'Built and maintained fully automated DevSecOps CI/CD pipelines for a SaaS platform.',
      'Managed and optimized AWS infrastructure to improve uptime and reduce operational costs.',
      'Implemented monitoring and alerting using Prometheus and Grafana to ensure system reliability and performance.',
      'Developed Python automation scripts to eliminate repetitive tasks and streamline operations.'
    ],
  },
  {
    location: 'Uttarakhand, India',
    company: 'Rubico IT',
    role: 'DevOps Engineer',
    period: 'Mar 2024 – Oct 2025',
    bullets: [
      'Designed and implemented CI/CD pipelines across development, staging, and production environments.',
      'Set up monitoring and alerting systems using AWS CloudWatch and Grafana for production workloads.'
    ],
  },
]

export const education: Education[] = [
  {
    title: "Bachelor's of Technology in Computer Science and Engineering",
    period: '2020 – 2024',
    institution: 'Graphic Era University',
    description: 'Study about the core software engineering subjects, and a bit of system design. Graduated with First Class Honors, and a CGPA of 8.67/10.',
    loc: 'Uttarakhand, India',
  },
]

export const socialLinks: SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/hemupadhyay26',
    Icon: Github,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/hem-upadhyay-4460b31b9/',
    Icon: Linkedin,
  },
  {
    id: 'devto',
    label: 'Dev.to',
    href: 'https://dev.to/hem_upadhyay_ad9428dc9ddc',
    Icon: MessageSquare,
  },
]

export const tracks: Track[] = [
  {
    title: 'Audio 1',
    artist: 'No copyright music',
    src: audio1,
  },
  {
    title: 'Audio 2',
    artist: 'No copyright music',
    src: audio2,
  },
  {
    title: 'Audio 3',
    artist: 'No copyright music',
    src: audio3,
  },
]
