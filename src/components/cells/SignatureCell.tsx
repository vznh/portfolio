import { profile } from "@/presets/profile";

// Left column cell below the glyph: name, then the short SHA of the deployed commit.
export function SignatureCell() {
  return (
    <p className="flex gap-3 text-[13px] text-black">
      <span>{profile.name}</span>
      <span className="tabular-nums opacity-40">{process.env.NEXT_PUBLIC_COMMIT_SHA}</span>
    </p>
  );
}
