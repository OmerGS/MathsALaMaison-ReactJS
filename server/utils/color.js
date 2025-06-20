export const ColorEnum = Object.freeze({
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m',
    DIM: '\x1b[2m',
    UNDERLINE: '\x1b[4m',
    INVERSE: '\x1b[7m',
    HIDDEN: '\x1b[8m',

    // Text colors
    BLACK: '\x1b[30m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',

    // Background colors
    BG_BLACK: '\x1b[40m',
    BG_RED: '\x1b[41m',
    BG_GREEN: '\x1b[42m',
    BG_YELLOW: '\x1b[43m',
    BG_BLUE: '\x1b[44m',
    BG_MAGENTA: '\x1b[45m',
    BG_CYAN: '\x1b[46m',
    BG_WHITE: '\x1b[47m',
});

export function colorize(text, color) {
    if (!Object.values(ColorEnum).includes(color)) {
        console.error(`Erreur : La couleur "${color}" n'est pas définie dans ColorEnum.`);
        return text;
    }
    return `${color}${text}${ColorEnum.RESET}`;
}

