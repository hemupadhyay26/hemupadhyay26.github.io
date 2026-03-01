import type { NavLink as NavLinkType } from '../types'

type NavLinkProps = {
  link: NavLinkType
  className?: string
  onClick?: () => void
}

export function NavLink({ link, className, onClick }: NavLinkProps) {
  return (
    <a
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noreferrer' : undefined}
      className={className}
      onClick={onClick}
    >
      {link.label}
    </a>
  )
}
