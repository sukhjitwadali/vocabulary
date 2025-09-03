export interface WordData {
  word: string;
  meaning: string;
  examples: string[];
  savedAt: Date;
}

export interface DictionaryAPIResponse {
  word: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}
