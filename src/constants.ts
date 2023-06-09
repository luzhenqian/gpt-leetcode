const DATA_PREFIX = 'data: ';
const MODEL_NAME = 'gpt-3.5-turbo';
const SYSTEM_MESSAGE = (
  language,
) => `Now we have an algorithm test, I am the teacher and you are the student.
I will give you an algorithm problem, including problem description and code template.
You just need to fill the code template correctly.
Use the ${language} language.
Without any explanation, we directly use markdown to output the original code.`;
const PROMPT_PREFIX = (description, template) => `topic outline: ${description}
code template: ${template},
Please complete the questions according to the template`;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHROME_STORAGE_KEY_API_KEY = 'apiKey';
const TEXT_DECODER_TYPE = 'utf-8';
const DONE_MARKER = '[DONE]';
const MESSAGE_TYPE_COMPLETE = 'complete';
const MESSAGE_TYPE_OUTPUT = 'output';
const MESSAGE_TYPE_COMPLETED = 'completed';
const CODE_GENERATING_TIME = 2000;
const CONTENT_SCRIPT_PATH = './dist/content/action.js';

export {
  DATA_PREFIX,
  MODEL_NAME,
  SYSTEM_MESSAGE,
  PROMPT_PREFIX,
  OPENAI_API_URL,
  CHROME_STORAGE_KEY_API_KEY,
  TEXT_DECODER_TYPE,
  DONE_MARKER,
  MESSAGE_TYPE_COMPLETE,
  MESSAGE_TYPE_OUTPUT,
  MESSAGE_TYPE_COMPLETED,
  CODE_GENERATING_TIME,
  CONTENT_SCRIPT_PATH,
};
