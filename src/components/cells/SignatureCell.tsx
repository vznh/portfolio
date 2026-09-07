import { profile } from "@/presets/profile";

// Left column cell below the glyph: name, then the short SHA of the deployed
// commit, linking to that commit on GitHub.
export function SignatureCell() {
  const sha = process.env.NEXT_PUBLIC_COMMIT_SHA ?? "";
  return (
    <p className="flex gap-1.5 text-[13px] text-black">
      <span>{profile.name}</span>
      {sha ? (
        <a
          href={`${profile.repoUrl}/commit/${sha}`}
          target="_blank"
          rel="noreferrer"
          className="tabular-nums opacity-40 transition-opacity hover:opacity-100"
        >
          {sha.slice(0, 7)}
        </a>
      ) : (
        <span className="tabular-nums opacity-40">dev</span>
      )}
    </p>
  );
}
