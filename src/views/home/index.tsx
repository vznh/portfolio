// views/home/index.tsx
import { FC, Fragment } from 'react';
import { useCameraProp } from '@/hooks/useCameraProp';
import { cn } from '@/utils';

// this needs permission props for camera
interface HomeProps {}

export const HomeView: FC<HomeProps> = () => {
  const hasCameraPermission = useCameraProp();

  //? render camera component
  // if (!hasCameraPermission) { };

  return (
    <Fragment>
      <div className={cn(
        "flex flex-col",
        "h-full w-full"
      )}>
        <h1><b><a>Jason Son</a></b></h1>
        <span className="text-lg"><i>Co-founder of <a href="https://tokn.so"><u>Tokn</u></a>, a Web3 social token analytics platform, and <a href="https://landing-lime-five.vercel.app/"><u>Polyglot</u></a>, a one-stop shop to learn any language you want.</i></span>
    
        <h1><b>More platforms</b></h1>
        <div className="flex flex-row">
          <a href="https://www.instagram.com/jsonvinh/" className="text-lg"><i><u>Instagram</u></i></a>
          <a href="https://x.com/vivivinh" className="text-lg"><i><u>X.com</u></i></a>
          <a href="https://www.linkedin.com/in/vznh" className="text-lg"><i><u>LinkedIn</u></i></a>
          <a href="https://www.github.com/vznh" className="text-lg"><i><u>GitHub</u></i></a>
          <a href="https://music.apple.com/profile/jasonson2004" className="text-lg"><i><u>Apple Music</u></i></a>
        </div>
      </div>
    </Fragment>
  )
}