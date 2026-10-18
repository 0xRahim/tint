/*---------Types------------ */
export type Config = {
  enabled: boolean;
}


/*--------------ENUMS--------------- */
export enum Colors {
    CYAN = "\x1b[36m",
    BCYAN = "\x1b[96m",
    GREEN = "\x1b[32m",
    BGREEN = "\x1b[92m",
    RED = "\x1b[31m",
    BRED = "\x1b[91m",
    YELLOW = "\x1b[33m",
    BYELLOW = "\x1b[93m",
    WHITE = "\x1b[97m",
    GRAY = "\x1b[90m",
}

// signals
export enum Modifiers {
    RESET = "\x1b[0m",
    BOLD = "\x1b[1m",
    DIM = "\x1b[2m",
}

// glyphs
export enum Glyphs {
    OK      = "✓",
    FAIL    = "✗",
    BULLET  = "◆",
    ARROW   = "›",
    DOT     = "·",
    BAR     = "─",
}
