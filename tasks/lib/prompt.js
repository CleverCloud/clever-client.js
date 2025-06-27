import { confirm as iConfirm, input, password as iPassword } from '@inquirer/prompts';

/**
 * @param {string} message
 * @param {boolean} [password]
 * @returns {Promise<string>}
 */
export async function prompt(message, password = false) {
  if (password) {
    return await catchPrompt(iPassword({ message, mask: true }));
  }
  return await catchPrompt(input({ message }));
}

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
