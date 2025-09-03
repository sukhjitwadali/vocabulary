'use client';

import { useState } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { WordData } from '@/types/vocabulary';

interface AddWordTabProps {
  onWordSaved: (word: WordData) => void;
}

export default function AddWordTab({ onWordSaved }: AddWordTabProps) {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState<WordData | null>(null);

  const fetchWordData = async (wordToFetch: string): Promise<WordData | null> => {
    try {
      // Using Free Dictionary API from freedictionaryapi.com
      const response = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${wordToFetch.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }

      const data = await response.json();

      if (!data.entries || data.entries.length === 0) {
        throw new Error('No meanings found for this word');
      }

      // Get the first entry and its senses
      const firstEntry = data.entries[0];
      const senses = firstEntry.senses;

      if (!senses || senses.length === 0) {
        throw new Error('No definitions found for this word');
      }

      // Get the first definition
      const firstSense = senses[0];
      const meaning = firstSense.definition;
      
      // Collect examples from quotes and examples
      const examples: string[] = [];
      
      // First, try to get examples from quotes
      senses.forEach((sense: { quotes?: Array<{ text: string }> }) => {
        if (sense.quotes && examples.length < 2) {
          sense.quotes.forEach((quote: { text: string }) => {
            if (examples.length < 2) {
              examples.push(quote.text);
            }
          });
        }
      });

      // If we don't have enough examples from quotes, try examples array
      if (examples.length < 2) {
        senses.forEach((sense: { examples?: string[] }) => {
          if (sense.examples && examples.length < 2) {
            sense.examples.forEach((example: string) => {
              if (examples.length < 2) {
                examples.push(example);
              }
            });
          }
        });
      }

      // If we still don't have enough examples, create some generic ones
      while (examples.length < 2) {
        examples.push(`Example usage of "${wordToFetch}" in a sentence.`);
      }

      return {
        word: wordToFetch.toLowerCase(),
        meaning,
        examples: examples.slice(0, 2),
        savedAt: new Date()
      };
    } catch (error) {
      console.error('Error fetching word data:', error);
      throw error;
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    setLoading(true);
    setError('');
    setPreviewData(null);

    try {
      const wordData = await fetchWordData(word.trim());
      if (wordData) {
        setPreviewData(wordData);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch word data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (previewData) {
      onWordSaved(previewData);
      setWord('');
      setPreviewData(null);
    }
  };

  const handleClear = () => {
    setWord('');
    setPreviewData(null);
    setError('');
  };

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Add New Word
        </h1>
        
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter a word to look up..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              disabled={loading}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !word.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Looking up word...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Look Up Word</span>
              </>
            )}
          </button>
        </form>

        {/* Preview Section */}
        {previewData && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {previewData.word}
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Meaning:</h4>
                <p className="text-gray-900 leading-relaxed">{previewData.meaning}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Examples:</h4>
                <ul className="space-y-2">
                  {previewData.examples.map((example, index) => (
                    <li key={index} className="text-gray-900 leading-relaxed">
                      <span className="text-blue-600 font-medium">{index + 1}.</span> {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex space-x-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Word</span>
              </button>
              <button
                onClick={handleClear}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Enter any English word to get its meaning and examples</p>
        </div>
      </div>
    </div>
  );
}
