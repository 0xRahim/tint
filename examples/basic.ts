import { Colorizer, Colors } from "../index.ts";

const colorizer = new Colorizer({ enabled: true });

await colorizer.logofy("tint", Colors.BCYAN);
colorizer.separator();

colorizer.section("GETTING STARTED");
colorizer.info("A tiny colorizer for terminal output.");
console.log();
console.log(`  ${colorizer.paint("paint()", Colors.BCYAN)} returns a colorized string.`);
console.log(`  ${colorizer.paint("logofy()", Colors.BCYAN)} renders figlet text as a logo.`);
console.log(`  ${colorizer.paint("enabled: false", Colors.BCYAN)} strips all color codes.`);

colorizer.section("COMPONENTS");
colorizer.listItems("paint", Colors.CYAN);
colorizer.listItems("section", Colors.CYAN);
colorizer.listItemTagged("logofy", "  async", Colors.GREEN);
colorizer.listItemTagged("separator", "  utility", Colors.GREEN);

colorizer.section("STATUS");
colorizer.success("Everything is wired up.");
colorizer.info("Use the helpers to keep output consistent.");
colorizer.warn("Set enabled: false to strip ANSI colors.");
colorizer.failure("This failure is only a demo.");

colorizer.section("NEXT");
colorizer.promptPrefix("bun examples/dashboard.ts ocean", Colors.GREEN);
console.log();
