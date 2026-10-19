import { Colors, Modifiers, Glyphs } from "../types/types";
import type { Config } from "../types/types";
import figlet from "figlet";

export class Colorizer {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  paint = (text: string, color: Colors) => {
    if (!this.config.enabled) {
      return text;
    }
    return `${color}${text}${Modifiers.RESET}`;
  };

  logofy = (text: string, color: Colors): Promise<string> => {
    return new Promise((resolve, reject) => {
      figlet.text(text, { font: "ANSI Shadow" }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const output = `${color}${data ?? ""}${Modifiers.RESET}`;
        console.log(output);
        resolve(output);
      });
    });
  };
  separator = () => {
    console.log(`${Colors.GRAY}${Glyphs.BAR.repeat(48)}`);
  };

  section = (title: string, color: Colors = Colors.WHITE) => {
    console.log("\n");
    console.log(`${Modifiers.BOLD}${color}${title}${Modifiers.RESET}`);
  };

  success = (msg: string) => {
    console.log(
      `${Colors.BGREEN}${Modifiers.BOLD} ${Glyphs.OK}${Modifiers.RESET}${msg}${Modifiers.RESET}`,
    );
  };

  failure = (msg: string) => {
    console.log(
      `${Colors.BRED}${Modifiers.BOLD}  ${Glyphs.FAIL}  ${Modifiers.RESET}${Colors.WHITE}${msg}${Modifiers.RESET}`,
    );
  };

  info = (msg: string) => {
    console.log(`${Colors.GRAY}  ${Glyphs.ARROW}  ${Modifiers.RESET}${msg}`);
  };
  warn = (msg: string) => {
    console.log(
      `${Colors.BYELLOW}${Modifiers.BOLD}  !  ${Modifiers.RESET}${Colors.YELLOW}${msg}${Modifiers.RESET}`,
    );
  };

  // ── Data display ──────────────────────────────────────────────────────────────

  listItems = (name: string, color: Colors) => {
    console.log(
      `${color}  ${Glyphs.BULLET}  ${Modifiers.RESET}${Modifiers.BOLD}${Colors.WHITE}${name}${Modifiers.RESET}`,
    );
  };

  listItemTagged = (name: string, tag: string, color: Colors) => {
    console.log(
      `${color}  ${Glyphs.BULLET}  ${Modifiers.RESET}${Modifiers.BOLD}${Colors.WHITE}${name}${Modifiers.RESET}${Colors.GRAY}${tag}${Modifiers.RESET}`,
    );
  };

  promptPrefix = (label: string, color: Colors) => {
    console.log(`${color}${Modifiers.BOLD}  ${Glyphs.ARROW}  ${Modifiers.RESET}${Modifiers.BOLD}${label}${Modifiers.RESET} `);
  }
}
