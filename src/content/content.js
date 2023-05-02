// Function to send a message to the background script to complete the prompt
async function sendCompletionRequest() {
  try {
    const prompt = await generatePrompt();
    chrome.runtime.sendMessage({
      type: 'complete',
      data: prompt,
    });
  } catch (e) {
    console.log(e);
  }
}

// Invoke the sendCompletionRequest function
sendCompletionRequest();
