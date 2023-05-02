// Helper function to query the active tab
async function queryActiveTab() {
  const options = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(options);
  return tab;
}

// Helper function to inject the content script into the active tab
async function injectContentScript(tab) {
  const { id, url } = tab;
  const scriptOptions = {
    target: { tabId: id, allFrames: true },
    files: ['./src/content/content.js'],
  };
  await chrome.scripting.executeScript(scriptOptions);
  console.log(`Injecting content script to ${url}`);
}

// Function to start injecting the content script
async function startInjection() {
  try {
    const activeTab = await queryActiveTab();
    await injectContentScript(activeTab);
  } catch (error) {
    console.error(`Content script injection failed: ${error}`);
  }
}

// Function to copy the code to the clipboard
async function copyCode() {
  const codeElement = document.getElementById('code');
  const codeText = codeElement.textContent;
  const tempInput = document.createElement('textarea');
  tempInput.value = codeText;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  tempInput.remove();
}

// Function to initialize event listeners
async function initEventListeners() {
  const apiKeyElement = document.getElementById('api-key');
  const languageElement = document.getElementById('language');
  const saveButton = document.getElementById('save');
  const startButton = document.getElementById('start');
  const copyButton = document.getElementById('copy');
  const codeElement = document.getElementById('code');

  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyElement.value;
    const language = languageElement.value;
    chrome.storage.sync.set({ apiKey, language });
  });

  startButton.addEventListener('click', startInjection);

  copyButton.addEventListener('click', copyCode);

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === 'apiKey') {
        apiKeyElement.value = newValue;
      }
      if (key === 'language') {
        languageElement.value = newValue;
        codeElement.className = `language-${newValue}`;
      }
      if (key === 'code' && newValue) {
        codeElement.innerHTML = newValue;
        hljs.highlightAll();
      }
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`,
      );
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'output') {
      toggleCodeContainerVisibility();
      codeElement.innerHTML = message.data;
      hljs.highlightAll();
    }
  });
}

// Function to toggle the visibility of the code container
async function toggleCodeContainerVisibility() {
  const codeContainer = document.getElementById('code-container');
  const code = document.getElementById('code');

  if (code.innerHTML.trim() === '') {
    codeContainer.style.display = 'none';
  } else {
    codeContainer.style.display = 'block';
  }
}

// Function to initialize the extension
async function initialize() {
  toggleCodeContainerVisibility();

  initEventListeners();

  chrome.storage.sync.get(['apiKey', 'language', 'code'], (result) => {
    const apiKeyElement = document.getElementById('api-key');
    const languageElement = document.getElementById('language');
    const codeElement = document.getElementById('code');

    apiKeyElement.value = result.apiKey;
    languageElement.value = result.language;
    codeElement.className = `language-${result.language}`;
    if (result.code) {
      toggleCodeContainerVisibility();
      codeElement.innerHTML = result.code;
    }
    hljs.highlightAll();
  });
}

// Invoke the initialize function
initialize();
