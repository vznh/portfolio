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
          <span className="text-lg italic">
          <i>Regent&apos;s and Dean&apos;s Scholar <b>@UC Santa Cruz.</b></i>
          </span>
          <br />
          <span className="text-lg"><i>Ex-FAANG, Ex-Research <b>@Seoul National University</b>, <b>@Carnegie Mellon University</b>, <b>@UC Santa Cruz</b>.</i></span>
          <br />
          <span className="text-lg"><i>Previously acquired, now a founder <b>@Stanford University.</b></i></span>
          <h1><b>Related links</b></h1>
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
