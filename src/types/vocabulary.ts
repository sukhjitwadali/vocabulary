export interface WordData {
  word: string;
  meaning: string;
  examples: string[];
  savedAt: Date;
}

export interface DateGroup {
  date: string; // YYYY-MM-DD format
  displayDate: string; // "Today", "Yesterday", "Dec 15, 2024", etc.
  words: WordData[];
}

export interface DictionaryAPIResponse {
  word: string;
  entries: Array<{
    language: {
      code: string;
      name: string;
    };
    partOfSpeech: string;
    pronunciations?: Array<{
      type: string;
      text: string;
    }>;
    forms?: Array<{
      word: string;
      tags: string[];
    }>;
    senses: Array<{
      definition: string;
      tags?: string[];
      examples?: string[];
      quotes?: Array<{
        text: string;
        reference?: string;
      }>;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
  source?: {
    url: string;
    license: {
      name: string;
      url: string;
    };
  };
}
