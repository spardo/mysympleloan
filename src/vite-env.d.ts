/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: 'development' | 'production' | 'test';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer: any[];
  google_tag_manager?: any;
  _hsq: any[];
}