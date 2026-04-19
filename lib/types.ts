export type LevelKey = "child" | "teen" | "adult";

export interface Screen {
  num: string;
  title: string;
  titleEmphasis?: string;
  eyebrow?: string;
  contentMarkdown: string;
}

export interface Level {
  label: string;
  color: string;
  screens: Screen[];
}

export interface Topic {
  slug: string;
  title: string;
  titleEmphasis?: string;
  latinTag?: string;
  subtitle: string;
  levels: {
    child: Level;
    teen: Level;
    adult: Level;
  };
}

export interface UpcomingTopic {
  slug: string;
  title: string;
  titleEmphasis?: string;
  subtitle: string;
  comingSoon: true;
}

export const LEVEL_ORDER: LevelKey[] = ["child", "teen", "adult"];

export const LEVEL_META: Record<
  LevelKey,
  { order: string; label: string; short: string; accent: string; accentDeep: string }
> = {
  child: {
    order: "I",
    label: "LEVEL I · FOR CHILDREN",
    short: "Child",
    accent: "#B8943D",
    accentDeep: "#8C6F2C",
  },
  teen: {
    order: "II",
    label: "LEVEL II · FOR TEENS",
    short: "Teen",
    accent: "#8C2F2F",
    accentDeep: "#6B2020",
  },
  adult: {
    order: "III",
    label: "LEVEL III · FOR ADULTS",
    short: "Adult",
    accent: "#2B4A72",
    accentDeep: "#0E2038",
  },
};
