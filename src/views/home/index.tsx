// views/home/index.tsx
import { FC, Fragment } from 'react';
import { useCameraProp } from '@/hooks/useCameraProp';
import { cn } from '@/utils';

// this needs permission props for camera
interface HomeProps {}

export const HomeView: FC<HomeProps> = () => {
  // const hasCameraPermission = useCameraProp();

  //? render camera component
  // if (!hasCameraPermission) { };

  return (
    <Fragment>
      <div className={cn(
        "flex flex-col",
        "h-full w-full"
      )}>
        <h1><b>Jason Son</b></h1>
        <span className="text-lg"><i>Software <b>@</b> Apple, co-founder of <a href="https://tokn.so"><u>Tokn</u></a>, a Web3 social token analytics platform, and <a href="https://landing-lime-five.vercel.app/"><u>Polyglot</u></a>, a one-stop shop to learn any language you want.</i></span>
        <br />
        <span className="text-lg"><i>Regent&apos;s Scholar at UC Santa Cruz, Stanford&apos;s Startup Cohort of 2024.</i></span>
        <span className="text-lg"><i>Board on <a href="https://www.instagram.com/ucscsase/"><u>SASE</u></a>, <a href="https://tally.so/r/3E0Y62"><u>Dev Club</u></a>, <a href="https://discord.gg/eD9RN753zt"><u>Lego Club</u></a>.</i></span>
        <br />
        <span className="text-lg"><i>If you&apos;re interested in me or my work, <a href="https://cal.com/hobin/quick-chat"><u>book a call.</u></a></i></span>
        <span className="text-lg"><i>Previous commissions will pop up <u>here.</u></i></span>
        <h1><b>Related links</b></h1>
        <div className="flex flex-col">
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
              <a href="https://music.apple.com/profile/jasonson2004" className="text-lg"><i><u>Apple Music</u></i></a>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  )
}