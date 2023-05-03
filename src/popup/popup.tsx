import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Code } from './Code';
import { Settings } from './Settings';
import { Router, route } from 'preact-router';
import '../style.css';

function App() {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['apiKey'], ({ apiKey }) => {
      setHasApiKey(Boolean(apiKey));
      route(apiKey ? '/code' : '/settings');
    });
  }, []);

  return (
    <div class="p-4 flex flex-col gap-4 items-stretch w-[400px] h-[400px]">
      <Router>
        <Settings path="/settings" />
        <Code path="/code" />
      </Router>
    </div>
  );
}

render(<App />, document.getElementById('app'));
