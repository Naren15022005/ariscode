const blue = (s: string) => `\x1b[34m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;

export const info = (msg: string) => console.log(blue(msg));
export const success = (msg: string) => console.log(green(msg));
export const error = (msg: string) => console.error(red(msg));
