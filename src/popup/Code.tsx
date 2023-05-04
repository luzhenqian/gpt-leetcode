import { Link } from 'preact-router';
import { useState, useEffect, useRef } from 'preact/hooks';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { CODE_GENERATING_TIME, CONTENT_SCRIPT_PATH } from '../constants';

async function copyToClipboard(element: HTMLElement) {
  const codeText = element.textContent;
  const tempInput = document.createElement('textarea');
  tempInput.style.position = 'absolute';
  tempInput.style.left = '-9999px';
  tempInput.value = codeText;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  tempInput.remove();
}

async function getActiveTab() {
  const options = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(options);
  return tab;
}

async function injectContentScript(tab) {
  const { id, url } = tab;
  const scriptOptions = {
    target: { tabId: id, allFrames: true },
    files: [CONTENT_SCRIPT_PATH],
  };
  await chrome.scripting.executeScript(scriptOptions);
  console.log(`Injected content script into ${url}`);
}

async function startInjection() {
  try {
    const activeTab = await getActiveTab();
    await injectContentScript(activeTab);
  } catch (error) {
    console.error(`Content script injection failed: ${error}`);
  }
}

function extractCode(code: string): string {
  const regex = /^```[\w+#]*\n?([\s\S]*?)\n?```$/m;
  const match = code.match(regex);
  if (match) {
    return match[1];
  } else {
    const commentRegex = /^\/\*[\s\S]*?\*\/([\s\S]*)$/m;
    const commentMatch = code.match(commentRegex);
    if (commentMatch) {
      const code = commentMatch[1].trim();
      const languageRegex = /^[\w+#]+\s+/;
      const languageMatch = code.match(languageRegex);
      if (languageMatch) {
        return code.slice(languageMatch[0].length);
      }
      return code;
    } else {
      return code.trim();
    }
  }
}

export function Code(_: ComponentPropsWithPath) {
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const copyButtonRef = useRef(null);

  useEffect(() => {
    chrome.storage.sync.get(['language', 'code'], (result) => {
      if (result.code) {
        setCode(result.code);
      }
      if (result.language) {
        setLanguage(result.language);
      }
    });

    const listener = (message, sender, sendResponse) => {
      if (message.type === 'output') {
        let code = message.data;
        setCode(code);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const generatingTimerRef = useRef(null);

  useEffect(() => {
    if (code.trim().length === 0) {
      return;
    }

    setIsGenerating(true);

    if (generatingTimerRef.current) {
      clearTimeout(generatingTimerRef.current);
    }

    generatingTimerRef.current = setTimeout(() => {
      setCode(code);
      setIsGenerating(false);
    }, CODE_GENERATING_TIME);
  }, [code]);

  const codeRef = useRef(null);

  return (
    <>
      <Link href="/settings">
        <div class="flex justify-end items-center text-gray-400">Settings</div>
      </Link>

      <button
        class="block w-full py-2 px-3 rounded-lg shadow-sm bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        onClick={startInjection}
        disabled={isGenerating}
      >
        Generate
      </button>

      <div class={`relative ${code.trim().length > 0 ? 'block' : 'hidden'}`}>
        <pre class="block border border-gray-300 p-3 rounded-lg shadow-sm text-gray-700 placeholder gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-auto">
          <code
            id="code"
            ref={codeRef}
            class={`hljs language-${language}`}
            dangerouslySetInnerHTML={{
              __html: marked(code, {
                highlight: function (code, lang) {
                  const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                  const result = hljs.highlight(code, { language }).value;
                  return result;
                },
              }),
            }}
          ></code>
        </pre>
        <button
          class="absolute top-2 right-2 bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          ref={copyButtonRef}
          onClick={async () => {
            await copyToClipboard(codeRef.current);
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, CODE_GENERATING_TIME);
          }}
        >
          {isCopied ? (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 1024 1024"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
            </svg>
          ) : (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
