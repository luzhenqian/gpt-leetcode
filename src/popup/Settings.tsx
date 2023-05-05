import {
  API_KEY,
  CODE_LANGUAGE,
  CODE_LANGUAGES,
  UI_LANGUAGE,
  UI_LANGUAGES,
} from '@/constants';
import { getStorage } from '@/utils/storage';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('');
  const [uiLanguage, setUiLanguage] = useState('');
  const { i18n } = useTranslation();

  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const _apiKey = await getStorage<string>(API_KEY);
      const _language = await getStorage<string>(CODE_LANGUAGE);
      const _uiLanguage = await getStorage<string>(UI_LANGUAGE);
      setApiKey(_apiKey || '');
      setCodeLanguage(_language || CODE_LANGUAGES[0]);
      setUiLanguage(
        _uiLanguage || (navigator.language.startsWith('zh') ? 'zh' : 'en'),
      );
    })();
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ apiKey, codeLanguage, uiLanguage });
    i18n.changeLanguage(uiLanguage);
    route('/code');
  };

  return (
    <>
      <label htmlFor="api-key" className="block font-medium text-gray-700">
        {t('settings.enter_your_api_key')}
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
        {t('settings.select_your_preferred_programming_language')}
      </label>
      <select
        id="language"
        name="language"
        value={codeLanguage}
        onChange={(e: any) => setCodeLanguage(e.target.value)}
        className="block w-full px-3 py-2 text-gray-700 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="" disabled selected hidden>
          {t('settings.select_language')}
        </option>
        {CODE_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <label htmlFor="ui-language" className="block font-medium text-gray-700">
        {t('settings.select_your_preferred_ui_language')}
      </label>
      <select
        id="ui-language"
        name="ui-language"
        value={uiLanguage}
        onChange={(e: any) => setUiLanguage(e.target.value)}
        className="block w-full px-3 py-2 text-gray-700 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="" disabled selected hidden>
          {t('settings.select_language')}
        </option>
        {UI_LANGUAGES.map((lang) => (
          <option key={lang} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>

      <button
        id="save"
        onClick={handleSave}
        className="block w-full px-3 py-2 text-white bg-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {t('settings.save')}
      </button>
    </>
  );
}
