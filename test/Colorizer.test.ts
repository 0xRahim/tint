import { describe, expect, spyOn, test } from "bun:test";
import { Colorizer } from "../lib/Colorizer";
import { Colors, Modifiers } from "../types/types";

async function captureLogs(fn: () => void | Promise<void>): Promise<string[]> {
  const logs: string[] = [];
  const spy = spyOn(console, "log").mockImplementation((...args: any[]) => {
    logs.push(args.map((arg) => String(arg)).join(" "));
  });

  try {
    await fn();
  } finally {
    spy.mockRestore();
  }

  return logs;
}

describe("Colorizer", () => {
  test("should colorize text", () => {
    const colorizer = new Colorizer({ enabled: true });

    const result = colorizer.paint("Hello", Colors.GREEN);

    expect(result).toBe(`${Colors.GREEN}Hello${Modifiers.RESET}`);
  });

  test("should return plain text when disabled", () => {
    const colorizer = new Colorizer({ enabled: false });

    const result = colorizer.paint("Hello", Colors.GREEN);

    expect(result).toBe("Hello");
  });

  test("should print a colorized logo", async () => {
    const colorizer = new Colorizer({ enabled: true });
    let output = "";

    const logs = await captureLogs(async () => {
      output = await colorizer.logofy("Hello", Colors.GREEN);
    });

    expect(logs).toHaveLength(1);
    expect(logs[0]).toContain(Colors.GREEN);
    expect(logs[0]).toContain(Modifiers.RESET);
    expect(output).toBe(logs[0] as string);
    expect(output.length).toBeGreaterThan(Colors.GREEN.length + Modifiers.RESET.length);
  });

  test("should print a separator", async () => {
    const colorizer = new Colorizer({ enabled: true });

    const logs = await captureLogs(() => colorizer.separator());

    expect(logs[0]).toContain("─");
  });

  test("should print a section with the given color", async () => {
    const colorizer = new Colorizer({ enabled: true });

    const logs = await captureLogs(() => colorizer.section("Status", Colors.CYAN));

    expect(logs.join("\n")).toContain(`${Modifiers.BOLD}${Colors.CYAN}Status${Modifiers.RESET}`);
  });

  test("should print status messages", async () => {
    const colorizer = new Colorizer({ enabled: true });

    const success = await captureLogs(() => colorizer.success("done"));
    const failure = await captureLogs(() => colorizer.failure("failed"));
    const info = await captureLogs(() => colorizer.info("details"));
    const warn = await captureLogs(() => colorizer.warn("careful"));

    expect(success[0]).toContain("✓");
    expect(success[0]).toContain("done");
    expect(failure[0]).toContain("✗");
    expect(failure[0]).toContain("failed");
    expect(info[0]).toContain("›");
    expect(info[0]).toContain("details");
    expect(warn[0]).toContain("!");
    expect(warn[0]).toContain("careful");
  });

  test("should print list items and tags", async () => {
    const colorizer = new Colorizer({ enabled: true });

    const plain = await captureLogs(() => colorizer.listItems("paint", Colors.CYAN));
    const tagged = await captureLogs(() =>
      colorizer.listItemTagged("logofy", "stable", Colors.GREEN),
    );

    expect(plain[0]).toContain("◆");
    expect(plain[0]).toContain("paint");
    expect(tagged[0]).toContain("logofy");
    expect(tagged[0]).toContain("stable");
  });

  test("should print a prompt prefix", async () => {
    const colorizer = new Colorizer({ enabled: true });

    const logs = await captureLogs(() => colorizer.promptPrefix("Continue", Colors.GREEN));

    expect(logs[0]).toContain("›");
    expect(logs[0]).toContain("Continue");
  });
});
