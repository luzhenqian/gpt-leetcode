import { MESSAGE_TYPE_COMPLETE } from '../constants';
import { generatePrompt } from './initializer';

/**
 * Sends a message to the background script to complete the prompt.
 * @throws {Error} if an error occurs while generating the prompt.
 */
async function sendCompletionRequest(): Promise<void> {
  try {
    const prompt = await generatePrompt();
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE_COMPLETE,
      data: prompt,
    });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate prompt.');
  }
}

// Invoke the sendCompletionRequest function
void sendCompletionRequest();
