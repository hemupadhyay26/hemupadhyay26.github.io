import { Mascot } from 'page-mascot'
import './PageMascot.css'

export function PageMascot() {
  return (
    <Mascot
      directions="/mascots/koala-directions.webp"
      reactions="/mascots/koala-reactions.webp"
      size={150}
      className="page-mascot"
      label="koala"
    />
  )
}
