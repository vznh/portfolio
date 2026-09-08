import { Shell } from "@/components/Layout";
import { GlyphCell } from "@/components/cells/GlyphCell";
import { SignatureCell } from "@/components/cells/SignatureCell";
import { LocationsCell } from "@/components/cells/LocationsCell";
import { OpenedSectionsCell } from "@/components/cells/OpenedSectionsCell";
import { ProseCell } from "@/components/cells/ProseCell";
import { ExpandedSectionsProvider } from "@/hooks/useExpandedSections";

export default function IndexView() {
  return (
    <ExpandedSectionsProvider>
      <Shell
        left={{ content: <GlyphCell />, below: [<SignatureCell key="signature" />, null] }}
        middle={<ProseCell />}
        right={{ content: <LocationsCell />, below: [<OpenedSectionsCell key="opened" />] }}
      />
    </ExpandedSectionsProvider>
  );
}
