import { MESSAGE_TYPE_COMPLETED, PROMPT_PREFIX } from '../constants';

/**
 * Generates the topic outline and code template from the current page.
 * @async
 * @function
 * @returns {Promise<string | undefined>} The generated prompt or undefined if elements not found.
 */
export async function generatePrompt(): Promise<string | undefined> {
  const descriptionEl: HTMLElement | null = document.querySelector(
    '[data-track-load="qd_description_content"]',
  );
  const templateEl: HTMLElement | null = document.querySelector(
    '.monaco-mouse-cursor-text',
  );
  if (!descriptionEl || !templateEl) return;
  const prompt = PROMPT_PREFIX(descriptionEl.innerText, templateEl.innerText);
  return prompt;
}

/**
 * Completes the code using the given answer.
 * @async
 * @function
 * @param {string | undefined} answer The completed code to be pasted.
 */
async function completeCode(answer: string | undefined): Promise<void> {
  if (!answer) return;

  // TODO: complete the code
  // 1. select editor
  // 2. paste answer
  // 3. click submit button
}

// Message listener for receiving the completed code
chrome.runtime.onMessage.addListener(function (
  message: { type: string; data: string },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
): void {
  if (message.type === MESSAGE_TYPE_COMPLETED) {
    chrome.storage.local.set({
      code: message.data,
    });

    completeCode(message.data);
  }
});
