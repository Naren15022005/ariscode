import chalk from "chalk";

export const info = (msg: string) => console.log(chalk.blue(msg));
export const success = (msg: string) => console.log(chalk.green(msg));
export const error = (msg: string) => console.error(chalk.red(msg));
