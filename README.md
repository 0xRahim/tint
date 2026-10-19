# tint

A small terminal colorizer with helpers for headings, status messages, lists, prompts, and figlet logos.

## Install

```bash
bun install
```

## Usage

```ts
import { Colorizer, Colors } from "./index.ts";

const colorizer = new Colorizer({ enabled: true });

console.log(colorizer.paint("Hello", Colors.GREEN));
colorizer.section("Status", Colors.CYAN);
colorizer.success("Everything is wired up.");
```

## Examples

```bash
bun run example               # dashboard with the default ocean theme
bun run example ocean         # dashboard with a specific theme
bun run example:gallery       # every theme variation
bun run example:basic         # minimal usage
```

Available themes: `ocean`, `ember`, `forest`, `mono`.

## Test

```bash
bun test
```
