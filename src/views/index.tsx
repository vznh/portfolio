import { Shell } from "@/components/Layout";
import { GlyphCell } from "@/components/cells/GlyphCell";
import { SignatureCell } from "@/components/cells/SignatureCell";
import { EmptyCell } from "@/components/cells/EmptyCell";
import { LocationsCell } from "@/components/cells/LocationsCell";
import { ProseCell } from "@/components/cells/ProseCell";

export default function IndexView() {
  return (
    <Shell
      left={{ content: <GlyphCell />, below: [<SignatureCell key="signature" />, <EmptyCell key="empty" />] }}
      middle={<ProseCell />}
      right={{ content: <LocationsCell /> }}
    />
  );
}
