import type { Sfx } from "./types";

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(next: boolean) {
  muted = next;
}

export function resumeAudio() {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  if (!ctx) ctx = new Ctx();
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, when: number, slide = 0) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, when);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), when + dur);
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(gain, when + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(when);
  o.stop(when + dur + 0.02);
}

export function playSfx(kind: Sfx) {
  if (muted || !ctx || ctx.state !== "running") return;
  const t = ctx.currentTime;
  if (kind === "hit") {
    tone(196, 0.09, "square", 0.05, t, -80);
    tone(90, 0.12, "triangle", 0.04, t);
  } else if (kind === "heal") {
    tone(520, 0.12, "sine", 0.04, t, 80);
    tone(780, 0.14, "sine", 0.03, t + 0.05);
  } else if (kind === "block") {
    tone(240, 0.08, "triangle", 0.05, t);
    tone(360, 0.1, "triangle", 0.03, t + 0.03);
  } else if (kind === "card") {
    tone(660, 0.05, "square", 0.03, t);
  } else if (kind === "door") {
    tone(140, 0.18, "sawtooth", 0.03, t, -40);
  } else if (kind === "rage") {
    tone(110, 0.28, "sawtooth", 0.05, t, -50);
    tone(70, 0.32, "square", 0.04, t);
  } else if (kind === "poison") {
    tone(320, 0.1, "triangle", 0.03, t, -140);
  } else if (kind === "unlock") {
    tone(523, 0.1, "triangle", 0.04, t);
    tone(659, 0.12, "triangle", 0.04, t + 0.08);
    tone(784, 0.16, "triangle", 0.04, t + 0.16);
  } else if (kind === "win") {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, "triangle", 0.04, t + i * 0.12));
  } else if (kind === "lose") {
    tone(220, 0.3, "triangle", 0.05, t, -120);
    tone(130, 0.4, "sine", 0.04, t + 0.1);
  } else {
    tone(480, 0.04, "square", 0.02, t);
  }
}
