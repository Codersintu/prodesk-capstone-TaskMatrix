import Hero from "./Hero";
import BackgroundEffects from "./BackgroundEffects";

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden text-white"
      style={{ backgroundColor: "#080610" }}
    >
      {/* Background */}
      <BackgroundEffects />

      {/* Foreground content */}
      <div className="relative z-10">
        <Hero />
      </div>
    </main>
  );
}