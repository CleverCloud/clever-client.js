import { confirm as iConfirm } from '@inquirer/prompts';

export async function confirm(message: string, defaultValue = true): Promise<boolean> {
  return await catchPrompt(iConfirm({ message, default: defaultValue }));
}

function catchPrompt<T>(promise: Promise<T>): Promise<T> {
  return promise.catch((error) => {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      process.exit(1);
    }
    throw error;
  });
}
