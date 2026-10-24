import { useEffect } from "react";
import { resumeAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import { Camp } from "./camp";
import { Delve } from "./delve";
import { HeroSheet, Rules } from "./overlays";
import { Results } from "./results";

export function Game() {
  const hydrated = useGame((s) => s.hydrated);
  const hydrate = useGame((s) => s.hydrate);
  const run = useGame((s) => s.run);
  const results = useGame((s) => s.results);
  const rules = useGame((s) => s.rules);
  const sheet = useGame((s) => s.sheet);
  const banner = useGame((s) => s.banner);
  const dismissBanner = useGame((s) => s.dismissBanner);
  const floaters = useGame((s) => s.floaters);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const unlock = () => resumeAudio();
    window.addEventListener("pointerdown", unlock, { once: false });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    if (!banner) return;
    const t = window.setTimeout(() => dismissBanner(), 2600);
    return () => window.clearTimeout(t);
  }, [banner, dismissBanner]);

  useEffect(() => {
    const first = floaters[0];
    if (!first) return;
    const t = window.setTimeout(() => {
      useGame.setState((s) => ({ floaters: s.floaters.filter((f) => f.id !== first.id) }));
    }, 880);
    return () => window.clearTimeout(t);
  }, [floaters]);

  if (!hydrated) {
    return (
      <main className="screen">
        <header className="mast">
          <p className="kicker">Guild hall</p>
          <h1>Adventure Cards</h1>
          <p className="lede">Shuffling the decks…</p>
        </header>
      </main>
    );
  }

  return (
    <main>
      {banner ? (
        <button type="button" className="banner" onClick={dismissBanner}>
          {banner.text}
        </button>
      ) : null}
      {results ? <Results /> : run ? <Delve /> : <Camp />}
      {rules ? <Rules /> : null}
      {sheet ? <HeroSheet /> : null}
    </main>
  );
}
