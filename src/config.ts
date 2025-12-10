import fs from 'fs';
import path from 'path';
import toml from '@iarna/toml';

const configFileName = 'config.toml';

interface Config {
  GENERAL: {
    PORT: number;
    SIMILARITY_MEASURE: string;
    KEEP_ALIVE: string;
  };
  API_KEYS: {
    OPENAI: string;
    GROQ: string;
    ANTHROPIC: string;
    GEMINI: string;
  };
  API_ENDPOINTS: {
    SEARXNG: string;
    OLLAMA: string;
  };
  DATABASE: {
    URL: string;
  };
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const loadConfig = () => {
  try {
    return toml.parse(
      fs.readFileSync(path.join(__dirname, `../${configFileName}`), 'utf-8'),
    ) as any as Config;
  } catch (error) {
    // Return empty config if file doesn't exist (for production with env vars)
    return {} as Config;
  }
};

export const getPort = () => 
  Number(process.env.PORT) || loadConfig().GENERAL?.PORT || 3001;

export const getSimilarityMeasure = () =>
  process.env.SIMILARITY_MEASURE || loadConfig().GENERAL?.SIMILARITY_MEASURE || 'cosine';

export const getKeepAlive = () => 
  process.env.KEEP_ALIVE || loadConfig().GENERAL?.KEEP_ALIVE || '5m';

export const getOpenaiApiKey = () => 
  process.env.OPENAI_API_KEY || loadConfig().API_KEYS?.OPENAI || '';

export const getGroqApiKey = () => 
  process.env.GROQ_API_KEY || loadConfig().API_KEYS?.GROQ || '';

export const getAnthropicApiKey = () => 
  process.env.ANTHROPIC_API_KEY || loadConfig().API_KEYS?.ANTHROPIC || '';

export const getGeminiApiKey = () => 
  process.env.GEMINI_API_KEY || loadConfig().API_KEYS?.GEMINI || '';

export const getSearxngApiEndpoint = () =>
  process.env.SEARXNG_API_URL || loadConfig().API_ENDPOINTS?.SEARXNG || 'http://localhost:4000';

export const getOllamaApiEndpoint = () => 
  process.env.OLLAMA_API_URL || loadConfig().API_ENDPOINTS?.OLLAMA || '';

export const getDatabaseUrl = () => {
  // First try environment variable, then fall back to config file
  return process.env.DATABASE_URL || loadConfig().DATABASE?.URL || '';
};

export const updateConfig = (config: RecursivePartial<Config>) => {
  const currentConfig = loadConfig();

  for (const key in currentConfig) {
    if (!config[key]) config[key] = {};

    if (typeof currentConfig[key] === 'object' && currentConfig[key] !== null) {
      for (const nestedKey in currentConfig[key]) {
        if (
          !config[key][nestedKey] &&
          currentConfig[key][nestedKey] &&
          config[key][nestedKey] !== ''
        ) {
          config[key][nestedKey] = currentConfig[key][nestedKey];
        }
      }
    } else if (currentConfig[key] && config[key] !== '') {
      config[key] = currentConfig[key];
    }
  }

  fs.writeFileSync(
    path.join(__dirname, `../${configFileName}`),
    toml.stringify(config),
  );
};
