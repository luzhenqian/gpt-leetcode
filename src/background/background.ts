import {
  CHROME_STORAGE_KEY_API_KEY,
  DATA_PREFIX,
  DONE_MARKER,
  MESSAGE_TYPE_COMPLETE,
  MESSAGE_TYPE_COMPLETED,
  MESSAGE_TYPE_OUTPUT,
  MODEL_NAME,
  OPENAI_API_URL,
  SYSTEM_MESSAGE,
  TEXT_DECODER_TYPE,
} from '../constants';

/**
 * Get value from Chrome storage.
 * @async
 * @function
 * @param {string} key - The key to get the value.
 * @returns {Promise<any>} The promise that resolves with the value.
 */
async function getFromChromeStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

/**
 * Process chat response chunks.
 * @function
 * @param {string} chunk - The chat response chunk to process.
 * @param {function} callback - The callback function to handle the processed message.
 */
function processChatResponseChunk(chunk, callback) {
  const onDeltaContentCallback = (parsedChunk) => {
    if (parsedChunk.choices && parsedChunk.choices.length > 0) {
      if (parsedChunk.choices[0].delta.content) {
        callback(parsedChunk.choices[0].delta.content);
      }
    }
  };

  chunk
    .split(DATA_PREFIX)
    .filter((item) => item.trim() !== '')
    .forEach((dataItem) => {
      const parsedChunk = JSON.parse(dataItem);
      onDeltaContentCallback(parsedChunk);
    });
}

/**
 * Fetch chat completion from OpenAI API.
 * @async
 * @function
 * @param {string} apiKey - The API key to access OpenAI API.
 * @param {string} prompt - The prompt to complete.
 * @param {function} callback - The callback function to handle the output message.
 * @returns {Promise<string>} The promise that resolves with the completed message.
 */
async function fetchChatCompletion(apiKey, prompt, callback) {
  if (!prompt) return;
  const language = await getFromChromeStorage('language');
  if (!language) return;

  const url = OPENAI_API_URL;
  const body = {
    model: MODEL_NAME,
    messages: [
      {
        role: 'system',
        content: SYSTEM_MESSAGE(language),
      },
      { role: 'user', content: `${prompt}` },
    ],
    stream: true,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder(TEXT_DECODER_TYPE);
  let message = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    let chunk = decoder.decode(value);
    if (chunk.trim().includes(DONE_MARKER)) {
      break;
    }
    processChatResponseChunk(chunk, (content) => {
      message += content;
      callback?.(message);
    });
  }
  return message;
}
/**
 * Handle messages sent from the extension popup.
 * @async
 * @function
 * @param {Object} message - The message sent from the extension popup.
 * @param {Object} sender - The sender of the message.
 * @param {function} sendResponse - The response function to send back to the popup.
 */
async function handleMessage(message, sender, sendResponse) {
  if (message.type === MESSAGE_TYPE_COMPLETE) {
    const apiKey = await getFromChromeStorage(CHROME_STORAGE_KEY_API_KEY);
    const res = await fetchChatCompletion(apiKey, message.data, (message) => {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE_OUTPUT,
        data: message,
      });
    });
    chrome.tabs.sendMessage(sender.tab.id, {
      type: MESSAGE_TYPE_COMPLETED,
      data: res,
    });
  }
}

// Listen to messages sent from the extension popup.
chrome.runtime.onMessage.addListener(handleMessage);
