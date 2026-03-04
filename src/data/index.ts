import heroPortrait from '../assets/hero.webp'
import resumeFile from '../assets/hem_upadhyay_resume.pdf'
import projectInfuseAi from '../assets/projectInfuseAi.png'
import projectInterviewAi from '../assets/projectInterviewAi.png'
import projectSshCredManager from '../assets/projectSshCredManager.png'
import projectSlackNotification from '../assets/projectSlackNotification.png'
import audio1 from '../assets/audio/audio1.mp3'
import audio2 from '../assets/audio/audio2.mp3'
import audio3 from '../assets/audio/audio3.mp3'
import track1Cover from '../assets/audio/track1Cover.jpg'
import track2Cover from '../assets/audio/track2Cover.jpg'
import track3Cover from '../assets/audio/track3Cover.jpg'
import { Github, Linkedin, Mail, MessageSquare } from 'lucide-react'
import type { NavLink, Project, Experience, Education, FloatingTag, Track, SocialLink } from '../types'
import { ProjectShape, ProjectSize } from '../types'

export { heroPortrait, resumeFile }

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'My Work', href: '#work' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hem-upadhyay-4460b31b9/', external: true },
  { label: 'Preview Resume', href: resumeFile, external: true },
]

export const aboutText = `DevOps Engineer with 2+ years of experience building scalable AWS infrastructure, automating CI/CD pipelines, and improving reliability across production systems. Skilled in Terraform, Docker, GitHub Actions, Bitbucket, Gitea, and core AWS services including EC2, RDS, ECS, ECR, S3, IAM, SES, and CloudWatch. I focus on automation, uptime, secure deployments, and high-performance systems.

Alongside DevOps, I also work extensively with Python, creating automation scripts and internal tooling to streamline operations. I have hands-on experience in AI engineering, including building RAG models, developing AI agents using LangGraph, and applying Pydantic for robust data workflows. This blend of DevOps and AI enables me to design intelligent, automated solutions that improve efficiency and reduce operational complexity.`

export const emailAddress = 'hemupadhyay234@gmail.com'

export const myWork: Project[] = [
  {
    title: 'Infuse AI',
    description: 'A RAG based AI agent that help you get answers based on your documents.',
    cover: 'infuse ai',
    image: projectInfuseAi,
    shape: ProjectShape.MainSquare, // ← featured highlight, only ONE allowed, always large
  },
  {
    title: 'Interview AI',
    description: 'A AI agent that helps you prepare for your interviews based on the job description.',
    cover: 'interview ai',
    image: projectInterviewAi,
    shape: ProjectShape.Horizontal,
    size: ProjectSize.Small,
  },
  {
    title: 'SSH Credential Manager',
    description: 'A tool that helps you manage your SSH credentials.',
    cover: 'ssh credential manager',
    image: projectSshCredManager,
    shape: ProjectShape.Square,
    size: ProjectSize.Small,
  },
  {
    title: 'Slack Notification Template',
    description: 'A template for creating and sending notifications to Slack channels, enhancing team communication during CI/CD processes.',
    cover: 'slack notification template',
    image: projectSlackNotification,
    shape: ProjectShape.Square,
    size: ProjectSize.Small,
  },
]

export const experienceCards: Experience[] = [
  {
    location: 'Remote, Hyderabad',
    company: 'Strobes',
    role: 'Cloud Engineer',
    period: 'Nov 2025 – PRESENT',
    bullets: [],
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

export const education: Education[] = [
  {
    title: "Bachelor's of Technology in Computer Science and Engineering",
    period: '2020 – 2024',
    institution: 'Graphic Era University, Bhimtal, Uttarakhand',
  },
]

export const floatingTags: FloatingTag[] = [
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
  { label: 'Infrastructure as Code', top: '86%', left: '47%', delay: '0.7s', duration: '6.4s' },
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
    id: 'email',
    label: 'Copy email',
    href: '#',
    Icon: Mail,
    copyEmail: true,
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
    artwork: track1Cover,
    src: audio1,
  },
  {
    title: 'Audio 2',
    artist: 'No copyright music',
    artwork: track2Cover,
    src: audio2,
  },
  {
    title: 'Audio 3',
    artist: 'No copyright music',
    artwork: track3Cover,
    src: audio3,
  },
]
