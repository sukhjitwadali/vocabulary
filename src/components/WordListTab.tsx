'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { WordData } from '@/types/vocabulary';

interface WordListTabProps {
  words: WordData[];
}

export default function WordListTab({ words }: WordListTabProps) {
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());

  const toggleExpanded = (word: string) => {
    const newExpanded = new Set(expandedWords);
    if (newExpanded.has(word)) {
      newExpanded.delete(word);
    } else {
      newExpanded.add(word);
    }
    setExpandedWords(newExpanded);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const formatTime = (date: Date) => {
    return format(new Date(date), 'h:mm a');
  };

  if (words.length === 0) {
    return (
      <div className="p-4 pb-20">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Words</h1>
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No words saved yet</h3>
            <p className="text-gray-500">Start by adding your first word in the &quot;Add Word&quot; tab!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          My Words ({words.length})
        </h1>
        
        <div className="space-y-3">
          {words
            .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
            .map((wordData) => {
              const isExpanded = expandedWords.has(wordData.word);
              
              return (
                <div
                  key={`${wordData.word}-${wordData.savedAt.getTime()}`}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleExpanded(wordData.word)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {wordData.word}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(wordData.savedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(wordData.savedAt)}</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Meaning:</h4>
                          <p className="text-gray-900 leading-relaxed">{wordData.meaning}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Examples:</h4>
                          <ul className="space-y-2">
                            {wordData.examples.map((example, index) => (
                              <li key={index} className="text-gray-900 leading-relaxed">
                                <span className="text-blue-600 font-medium">{index + 1}.</span> {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
