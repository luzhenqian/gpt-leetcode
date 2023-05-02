// Helper function to get a value from Chrome storage
async function getFromChromeStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

// Helper function to process chat response chunks
function processChatResponseChunk(chunk, callback) {
  chunk
    .split('data: ')
    .filter((item) => item.trim() !== '')
    .forEach((dataItem) => {
      const parsedChunk = JSON.parse(dataItem);
      if (parsedChunk.choices && parsedChunk.choices.length > 0) {
        if (parsedChunk.choices[0].delta.content) {
          callback(parsedChunk.choices[0].delta.content);
        }
      }
    });
}

async function fetchChatCompletion(apiKey, prompt, callback) {
  if (!prompt) return;

  const language = await getFromChromeStorage('language');
  if (!language) return;

  const url = 'https://api.openai.com/v1/chat/completions';
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Now we have an algorithm test, I am the teacher and you are the student.
I will give you an algorithm problem, including problem description and code template.
You just need to fill the code template correctly.
Use the ${language} language.
Do not use Markdown, without any instructions, we directly output the original code.
Do not use Markdown, without any instructions, we directly output the original code.
Do not use Markdown, without any instructions, we directly output the original code.
`,
      },
      {
        role: 'user',
        content: `${prompt}`,
      },
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
  const decoder = new TextDecoder('utf-8');
  let message = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    let chunk = decoder.decode(value);
    if (chunk.trim().includes('[DONE]')) {
      break;
    }
    processChatResponseChunk(chunk, (content) => {
      message += content;
      callback?.(message);
    });
  }
  return message;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'complete') {
    const apiKey = await getFromChromeStorage('apiKey');
    const res = await fetchChatCompletion(apiKey, message.data, (message) => {
      chrome.runtime.sendMessage({
        type: 'output',
        data: message,
      });
    });
    chrome.tabs.sendMessage(sender.tab.id, {
      type: 'completed',
      data: res,
    });
  }
});
