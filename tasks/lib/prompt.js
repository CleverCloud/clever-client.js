import { confirm as internalConfirm, input as internalInput } from '@inquirer/prompts';

/**
 * @param {string} message
 * @returns {Promise<string>}
 */
export async function input(message) {
  return await catchPrompt(internalInput({ message }));
}

/**
 * @param {string} message
 * @param {boolean} [defaultValue]
 * @returns {Promise<boolean>}
 */
export async function confirm(message, defaultValue = true) {
  return await catchPrompt(internalConfirm({ message, default: defaultValue }));
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
