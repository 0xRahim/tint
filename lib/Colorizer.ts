
import { Colors, Modifiers, Glyphs } from "../types/types"
import type { Config } from "../types/types"

export class Colorizer {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  paint = (text: string,color:Colors) => {
    if (!this.config.enabled) {
      console.log(text);
    }
    return `${color}${text}${Modifiers.RESET}`
}
}
