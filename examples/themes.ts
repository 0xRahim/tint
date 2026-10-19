import { Colors } from "../index.ts";

export type Theme = {
  name: string;
  description: string;
  primary: Colors;
  accent: Colors;
  muted: Colors;
  success: Colors;
  warning: Colors;
  danger: Colors;
};

export const themes = {
  ocean: {
    name: "Ocean",
    description: "Cool cyan and deep blue tones.",
    primary: Colors.BCYAN,
    accent: Colors.CYAN,
    muted: Colors.GRAY,
    success: Colors.BGREEN,
    warning: Colors.BYELLOW,
    danger: Colors.BRED,
  },
  ember: {
    name: "Ember",
    description: "Warm yellows with a fiery accent.",
    primary: Colors.BYELLOW,
    accent: Colors.YELLOW,
    muted: Colors.GRAY,
    success: Colors.BGREEN,
    warning: Colors.BYELLOW,
    danger: Colors.BRED,
  },
  forest: {
    name: "Forest",
    description: "Natural greens for calm, quiet output.",
    primary: Colors.BGREEN,
    accent: Colors.GREEN,
    muted: Colors.GRAY,
    success: Colors.BGREEN,
    warning: Colors.BYELLOW,
    danger: Colors.BRED,
  },
  mono: {
    name: "Mono",
    description: "High-contrast grayscale for minimal terminals.",
    primary: Colors.WHITE,
    accent: Colors.WHITE,
    muted: Colors.GRAY,
    success: Colors.WHITE,
    warning: Colors.WHITE,
    danger: Colors.WHITE,
  },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;

export const themeNames = Object.keys(themes) as ThemeName[];

export function getTheme(name: string): Theme {
  return themes[name as ThemeName] ?? themes.ocean;
}
