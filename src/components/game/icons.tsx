import {
  Backpack,
  CloudLightning,
  Crown,
  DoorOpen,
  Droplet,
  Feather,
  Flame,
  Gem,
  HeartPulse,
  Leaf,
  Music,
  Shield,
  Skull,
  Sparkles,
  Sun,
  Swords,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/game/types";

const MAP: Record<IconName, LucideIcon> = {
  shield: Shield,
  music: Music,
  sun: Sun,
  leaf: Leaf,
  feather: Feather,
  flame: Flame,
  heart: HeartPulse,
  storm: CloudLightning,
  sword: Swords,
  skull: Skull,
  door: DoorOpen,
  pack: Backpack,
  gem: Gem,
  crown: Crown,
  droplet: Droplet,
  spark: Sparkles,
};

export function GameIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = MAP[name];
  return <Icon className={className ?? "icon"} aria-hidden="true" strokeWidth={1.75} />;
}
