import { confirm as iConfirm } from '@inquirer/prompts';

/**
 * @param {string} message
 * @param {boolean} [defaultValue]
 * @returns {Promise<boolean>}
 */
export async function confirm(message, defaultValue = true) {
  return await catchPrompt(iConfirm({ message, default: defaultValue }));
}

/**
 * @param {Promise<T>} promise
 * @returns {Promise<T>}
 * @template T
 */
async function catchPrompt(promise) {
  return promise.catch((error) => {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      process.exit(1);
    }
    throw error;
  });
}
