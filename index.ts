import { Colorizer } from "./lib/Colorizer"
import { Colors, Modifiers } from "./types/types"
const colorizer = new Colorizer({ enabled: true });

console.log(colorizer.paint("Hello", Colors.GREEN));
