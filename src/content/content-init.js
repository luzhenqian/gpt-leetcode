// Helper function to get the topic outline and code template
async function generatePrompt() {
  const descriptionEl = document.querySelector(
    '[data-track-load="qd_description_content"]',
  );
  const templateEl = document.querySelector('.monaco-mouse-cursor-text');
  const prompt = `topic outline: ${descriptionEl.innerText}
code template: ${templateEl.innerText}`;
  return prompt;
}

// Helper function to complete the code
async function completeCode(answer) {
  if (!answer) return;

  // TODO: complete the code
  // 1. select editor
  // 2. paste answer
  // 3. click submit button
}

// Message listener for receiving the completed code
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'completed') {
    chrome.storage.local.set({
      code: message.data,
    });

    completeCode(message.data);
  }
});
