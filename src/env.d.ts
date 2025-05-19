/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY?: string; // Make this optional
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
