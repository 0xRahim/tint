import {describe, expect,test} from "bun:test"
import { Colorizer } from "../lib/Colorizer"
import { Colors, Modifiers } from "../types/types"

describe("Colorizer", () => {
  test("should colorize text", () => {
    const colorizer = new Colorizer({ enabled: true });

    const result = colorizer.paint("Hello", Colors.GREEN);

    expect(result).toBe(
      `${Colors.GREEN}Hello${Modifiers.RESET}`,
    );
  });

  test("should return plain text when disabled", () => {
    const colorizer = new Colorizer({ enabled: false });

    const result = colorizer.paint("Hello", Colors.GREEN);

    expect(result).toBe("Hello");
  });
});
