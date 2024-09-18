import chalk from 'chalk';

export default class Logging {
    public static info = (args: unknown) =>
        console.log(
            chalk.blue(`[${new Date().toLocaleString()}] [INFO]`),
            typeof args === 'string' ? chalk.blueBright(args) : args,
        );
    public static warning = (args: unknown) =>
        console.log(
            chalk.yellow(`[${new Date().toLocaleString()}] [WARNING]`),
            typeof args === 'string' ? chalk.yellowBright(args) : args,
        );
    public static error = (args: unknown) =>
        console.log(
            chalk.red(`[${new Date().toLocaleString()}] [ERROR]`),
            typeof args === 'string' ? chalk.redBright(args) : args,
        );
}
