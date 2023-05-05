import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { Code } from '@/popup/Code';
import { Settings } from '@/popup/Settings';
import { Router, route } from 'preact-router';
import { getStorage } from '@/utils/storage';
import '../style.css';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales';

function App() {
  useEffect(() => {
    (async () => {
      const apiKey = getStorage('apiKey');
      route(apiKey ? '/code' : '/settings');
    })();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <div class="p-4 flex flex-col gap-4 items-stretch w-[400px] h-[400px] overflow-y-auto">
        <Router>
          <Settings path="/settings" />
          <Code path="/code" />
        </Router>
      </div>
    </I18nextProvider>
  );
}

render(<App />, document.getElementById('app'));
