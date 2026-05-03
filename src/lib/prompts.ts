import prompts from "prompts";
import chalk from "chalk";
import Handlebars from "handlebars";

export interface PromptConfig {
  type: "input" | "select" | "multiselect" | "confirm" | "number";
  name: string;
  message: string;
  initial?: any;
  default?: any;
  choices?: Array<{ title: string; value: any; selected?: boolean }>;
  validate?: string | ((value: any) => boolean | string);
  when?: string;
}

export async function executePrompts(
  promptConfigs: PromptConfig[],
  context: Record<string, any> = {}
): Promise<Record<string, any>> {
  const answers: Record<string, any> = { ...context };

  for (const promptConfig of promptConfigs) {
    if (promptConfig.when) {
      const shouldAsk = evaluateCondition(promptConfig.when, answers);
      if (!shouldAsk) continue;
    }

    if (answers[promptConfig.name] !== undefined) continue;

    let validateFn: ((value: any) => boolean | string) | undefined;

    if (typeof promptConfig.validate === "string") {
      const regex = new RegExp(promptConfig.validate);
      validateFn = (val: string) =>
        regex.test(val) || `Debe coincidir con el patrón: ${promptConfig.validate}`;
    } else if (typeof promptConfig.validate === "function") {
      validateFn = promptConfig.validate;
    }

    const response = await prompts({
      type: promptConfig.type,
      name: promptConfig.name,
      message: promptConfig.message,
      initial: promptConfig.initial || promptConfig.default,
      choices: promptConfig.choices,
      validate: validateFn,
    });

    if (response[promptConfig.name] === undefined) {
      console.log(chalk.yellow("\n⚠️  Cancelado por el usuario"));
      process.exit(0);
    }

    answers[promptConfig.name] = response[promptConfig.name];
  }

  return answers;
}

export function evaluateCondition(
  condition: string,
  context: Record<string, any>
): boolean {
  try {
    const func = new Function(...Object.keys(context), `return ${condition};`);
    return func(...Object.values(context));
  } catch {
    return true;
  }
}

Handlebars.registerHelper("includes", function (array: any[], value: any) {
  if (!Array.isArray(array)) return false;
  return array.includes(value);
});
