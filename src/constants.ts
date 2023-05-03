const DATA_PREFIX = 'data: ';
const MODEL_NAME = 'gpt-3.5-turbo';
const SYSTEM_MESSAGE = (
  language,
) => `Now we have an algorithm test, I am the teacher and you are the student.
I will give you an algorithm problem, including problem description and code template.
You just need to fill the code template correctly.
Use the ${language} language.
Do not use Markdown, Do not start with \`\`\`, without any instructions, we directly output the original code.
Do not use Markdown, Do not start with \`\`\`, without any instructions, we directly output the original code.
Do not use Markdown, Do not start with \`\`\`, without any instructions, we directly output the original code.`;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const TEXT_DECODER_TYPE = 'utf-8';
const DONE_MARKER = '[DONE]';
const MESSAGE_TYPE_COMPLETE = 'complete';
const CHROME_STORAGE_KEY_API_KEY = 'apiKey';
const MESSAGE_TYPE_OUTPUT = 'output';
const MESSAGE_TYPE_COMPLETED = 'completed';

export {
  DATA_PREFIX,
  MODEL_NAME,
  SYSTEM_MESSAGE,
  OPENAI_API_URL,
  TEXT_DECODER_TYPE,
  DONE_MARKER,
  MESSAGE_TYPE_COMPLETE,
  CHROME_STORAGE_KEY_API_KEY,
  MESSAGE_TYPE_OUTPUT,
  MESSAGE_TYPE_COMPLETED,
};
