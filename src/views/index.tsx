import { Shell } from "@/components/Layout";
import { GlyphCell } from "@/components/cells/GlyphCell";
import { SignatureCell } from "@/components/cells/SignatureCell";
import { LocationsCell } from "@/components/cells/LocationsCell";
import { SectionsCell } from "@/components/cells/SectionsCell";
import { ProseCell } from "@/components/cells/ProseCell";

export default function IndexView() {
  return (
    <Shell
      left={{ content: <GlyphCell />, below: [<SignatureCell key="signature" />, null] }}
      middle={<ProseCell />}
      right={{ content: <LocationsCell />, below: [<SectionsCell key="sections" />] }}
    />
  );
}
