import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { Code } from '@/popup/Code';
import { Settings } from '@/popup/Settings';
import { Router, route } from 'preact-router';
import '../style.css';

function App() {
  useEffect(() => {
    chrome.storage.sync.get(['apiKey'], ({ apiKey }) => {
      route(apiKey ? '/code' : '/settings');
    });
  }, []);

  return (
    <div class="p-4 flex flex-col gap-4 items-stretch w-[400px] h-[400px] overflow-y-auto">
      <Router>
        <Settings path="/settings" />
        <Code path="/code" />
      </Router>
    </div>
  );
}

render(<App />, document.getElementById('app'));
