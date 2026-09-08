import { profile } from "@/presets/profile";

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
          className="cursor-pointer tabular-nums opacity-[0.55] transition-opacity hover:opacity-100"
        >
          {sha.slice(0, 7)}
        </a>
      ) : (
        <span className="tabular-nums opacity-[0.55]">dev</span>
      )}
    </p>
  );
}
