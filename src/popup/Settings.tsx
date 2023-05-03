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

export function Settings({}: ComponentPropsWithPath) {
  const [apiKey, setApiKey] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['apiKey', 'language'], ({ apiKey, language }) => {
      setApiKey(apiKey || '');
      setLanguage(language || '');
    });
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
        className="block w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 text-gray-700 placeholder-gray-400"
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
        className="block w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 text-gray-700"
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
        className="block w-full py-2 px-3 rounded-lg shadow-sm bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save
      </button>
    </>
  );
}
