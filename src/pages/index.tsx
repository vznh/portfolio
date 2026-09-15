import IndexView from "@/views/index";
import { Meta } from "@/presets/meta";
import { Crossword } from "@/components/Crossword";

export default function HomePage() {
  return (
    <>
      <Meta />
      <div className="home-views">
        <div className="crossword-landing">
          <Crossword />
        </div>
        <div id="content" className="portfolio-content">
          <IndexView />
        </div>
      </div>
    </>
  );
}
