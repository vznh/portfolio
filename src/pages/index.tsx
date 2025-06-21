import IndexView from "@/views";
import Background from "@/components/Background";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Background />
      <IndexView />
    </main>
  );
}
