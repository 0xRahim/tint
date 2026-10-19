import { Colorizer } from "../index.ts";
import { renderDashboard } from "./dashboard.ts";
import { themes, themeNames } from "./themes.ts";

const colorizer = new Colorizer({ enabled: true });

for (const name of themeNames) {
  const theme = themes[name];

  console.log();
  console.log(colorizer.paint(`  ${theme.name.toUpperCase()}  `, theme.primary));
  console.log(colorizer.paint(`  ${theme.description}  `, theme.muted));
  console.log(colorizer.paint("─".repeat(56), theme.accent));

  await renderDashboard(theme);
}
