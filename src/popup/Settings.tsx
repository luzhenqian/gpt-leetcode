import { getStorage } from '@/utils/storage';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';

const languages = [
  'JavaScript',
  'C++',
  'Java',
  'Python',
  'Python3',
  'C',
  'C#',
  'Ruby',
  'Swift',
  'Go',
  'Scala',
  'Kotlin',
  'Rust',
  'PHP',
  'TypeScript',
  'Racket',
  'Erlang',
  'Elixir',
  'Dart',
];

function Option({ value }: { value: string }) {
  return <option value={value}>{value}</option>;
}

export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    (async () => {
      const _apiKey = await getStorage<string>('apiKey');
      const _language = await getStorage<string>('language');
      setApiKey(_apiKey || '');
      setLanguage(_language || '');
    })();
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ apiKey, language });
    route('/code');
  };

  return (
    <>
      <label htmlFor="api-key" className="block font-medium text-gray-700">
        Enter your API key
      </label>
      <input
        id="api-key"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        value={apiKey}
        onChange={(e: any) => setApiKey(e.target.value)}
        className="block w-full px-3 py-2 text-gray-700 placeholder-gray-400 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="API key"
      />

      <label htmlFor="language" className="block font-medium text-gray-700">
        Select your preferred programming language
      </label>
      <select
        id="language"
        name="language"
        value={language}
        onChange={(e: any) => setLanguage(e.target.value)}
        className="block w-full px-3 py-2 text-gray-700 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="" disabled selected hidden>
          Select language
        </option>
        {languages.map((lang) => (
          <Option key={lang} value={lang} />
        ))}
      </select>

      <button
        id="save"
        onClick={handleSave}
        className="block w-full px-3 py-2 text-white bg-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save
      </button>
    </>
  );
}
