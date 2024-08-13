// views/home/index.tsx
import { FC, Fragment } from 'react';
import { cn } from '@/utils';

// this needs permission props for camera
interface HomeProps {}

export const HomeView: FC<HomeProps> = () => {

  return (
    <Fragment>
      <div className={cn(
        "flex flex-col",
        "h-full w-full"
      )}>
        <h1><b>Jason Son</b></h1>
        <span className="text-lg"><i>Software Engineering Intern at <b>Apple</b>, assistant researcher at <b>Seoul National University</b>, co-founder of <a href="https://tokn.so"><u><b>Tokn</b></u></a>, a cryptocurrency social token analytics platform, and <a href="https://landing-lime-five.vercel.app/"><u><b>Polyglot</b></u></a>, a one-stop shop to learn any language you want.</i></span>
        <br />
        <span className="text-lg"><i>Regent&apos;s Scholar at UC Santa Cruz, Stanford&apos;s Startup Cohort of 2024.</i></span>
        <br />
        <span className="text-lg"><i>Book a chat <a href="https://cal.com/hobin/quick-chat"><u>here.</u></a> Resume and academic transcripts are not available to public.</i> </span>
        <h1><b>Related links of the sort</b></h1>
        <div className="border border-black flex flex-row">
          <ul>
            <li>
              <a href="https://www.instagram.com/jsonvinh/" className="text-lg"><i><u>Instagram</u></i></a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/vznh" className="text-lg"><i><u>LinkedIn</u></i></a>
            </li>
            <li>
              <a href="https://www.github.com/vznh" className="text-lg"><i><u>GitHub</u></i></a>
            </li>
            <li>
              <a href="https://www.reddit.com/user/son-hobin/" className="text-lg"><i><u>Reddit</u></i></a>
            </li>
            <li>
              <a href="https://open.spotify.com/user/31axml7xyxvqdf55teottiazjpc4?si=90fbd09d80c146c9" className="text-lg"><i><u>Spotify</u></i></a>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  )
}
