import { Colorizer, Colors, Glyphs, Modifiers } from "../index.ts";
import { getTheme, type Theme } from "./themes.ts";

const colorizer = new Colorizer({ enabled: true });

function statusRow(theme: Theme, label: string, value: string, color: Colors) {
  console.log(
    `${theme.muted}  ${label.padEnd(14)}${Modifiers.RESET}${color}${value}${Modifiers.RESET}`,
  );
}

export async function renderDashboard(theme: Theme) {
  console.log();
  await colorizer.logofy("tint", theme.primary);
  console.log(`${theme.muted}  ${theme.description}${Modifiers.RESET}`);
  colorizer.separator();

  colorizer.section("SYSTEM", theme.accent);
  statusRow(theme, "runtime", "bun 1.4.2", theme.primary);
  statusRow(theme, "status", `${Glyphs.OK} healthy`, theme.success);
  statusRow(theme, "uptime", "42d 07h 13m", theme.primary);
  statusRow(theme, "region", "eu-west-1", theme.primary);

  colorizer.section("SERVICES", theme.accent);
  colorizer.listItemTagged("api-gateway", "  online", theme.success);
  colorizer.listItemTagged("worker-pool", "  3/3 jobs", theme.success);
  colorizer.listItemTagged("cache", "  degraded", theme.warning);
  colorizer.listItemTagged("database", "  offline", theme.danger);

  colorizer.section("EVENTS", theme.accent);
  colorizer.success("deployment completed in 12.4s");
  colorizer.info("3 background jobs finished");
  colorizer.warn("cache hit rate dropped below 80%");
  colorizer.failure("worker-2 failed its health check");

  colorizer.section("NEXT", theme.accent);
  colorizer.promptPrefix("tint deploy --prod", theme.accent);
  console.log();
}

if (import.meta.main) {
  const themeName = process.argv[2] ?? "ocean";
  await renderDashboard(getTheme(themeName));
}
