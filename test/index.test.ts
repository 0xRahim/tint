import { describe, expect, test } from "bun:test";
import { Colorizer, Colors, Glyphs, Modifiers } from "../index.ts";
import type { Config } from "../index.ts";

describe("public API", () => {
  test("should export the Colorizer class and style enums", () => {
    expect(typeof Colorizer).toBe("function");
    expect(String(Colors.GREEN)).toBe("\x1b[32m");
    expect(String(Modifiers.RESET)).toBe("\x1b[0m");
    expect(String(Glyphs.OK)).toBe("✓");
  });

  test("should create a Colorizer through the public entrypoint", () => {
    const config: Config = { enabled: true };
    const colorizer = new Colorizer(config);

    expect(colorizer.paint("Hello", Colors.CYAN)).toBe(
      `${Colors.CYAN}Hello${Modifiers.RESET}`,
    );
  });
});
