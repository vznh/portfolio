import IndexView from "@/views";

interface HomeProps {
  version: string;
}

export default function Home({ version }: HomeProps) {
  return (
    <main className="relative min-h-screen">
      <IndexView version={version} />
    </main>
  );
}

// Resolve the latest release tag at build time (revalidated hourly) instead of
// fetching inside an effect on the client, which can race, double-fire, or leak.
export async function getStaticProps() {
  let version = "5.1";
  try {
    const response = await fetch(
      "https://api.github.com/repos/vznh/portfolio/releases/latest"
    );
    if (response.ok) {
      const release: { tag_name?: string } = await response.json();
      if (release.tag_name) version = release.tag_name;
    }
  } catch (error) {
    console.error("Failed to fetch GitHub release:", error);
  }

  return { props: { version }, revalidate: 3600 };
}
